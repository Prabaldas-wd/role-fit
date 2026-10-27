"""Mocked analysis. Replace with an LLM call that returns AnalyzeResponse-shaped JSON.

The mock does simple keyword matching so the end-to-end flow can be built and
tested before the AI provider is wired in.
"""

import re

KNOWN_SKILLS = [
    "React", "TypeScript", "JavaScript", "Redux", "Python", "Django", "Node.js",
    "CI/CD", "Docker", "Kubernetes", "AWS", "GraphQL", "SQL", "Testing",
]


def _contains(text: str, term: str) -> bool:
    return re.search(rf"(?<!\w){re.escape(term)}(?!\w)", text, re.IGNORECASE) is not None


def _bullets(resume_text: str) -> list[str]:
    lines = (line.strip().lstrip("-•*").strip() for line in resume_text.splitlines())
    return [line for line in lines if len(line) > 20]


def analyze(job_description: str, resume_text: str, target_role: str | None = None) -> dict:
    jd_skills = [s for s in KNOWN_SKILLS if _contains(job_description, s)]
    bullets = _bullets(resume_text)

    requirements = []
    gaps = []
    for skill in jd_skills:
        evidence = [b for b in bullets if _contains(b, skill)]
        requirements.append({
            "name": skill,
            "importance": "required",
            "evidence_status": "clearly_supported" if evidence else "not_found",
            "resume_evidence": evidence[:3],
        })
        if not evidence:
            gaps.append({
                "requirement": skill,
                "reason": "No supporting evidence was found in the supplied resume.",
            })

    recommendations = []
    for i, bullet in enumerate(bullets[:5], start=1):
        matched = next((s for s in jd_skills if _contains(bullet, s)), None)
        recommendations.append({
            "id": f"rec-{i:03d}",
            "section": "Experience",
            "action": "keep" if matched else "de_emphasize",
            "original_bullet": bullet,
            "suggested_bullet": None,
            "reason": (
                f"Directly relevant to the role's {matched} requirement."
                if matched
                else "No clear link to this role's key requirements."
            ),
            "related_requirement": matched,
            "supporting_evidence": [bullet] if matched else [],
            "requires_confirmation": False,
        })

    return {
        "requirements": requirements,
        "recommendations": recommendations,
        "gaps_to_confirm": gaps,
    }
