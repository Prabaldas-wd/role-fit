from rest_framework.test import APITestCase

JD = "We need a Frontend Engineer with React, TypeScript and Kubernetes experience."
RESUME = """
- Built and maintained React and TypeScript features for a dashboard.
- Organised the annual company hackathon for 200 attendees.
"""


class AnalyzeApiTests(APITestCase):
    def test_health(self):
        self.assertEqual(self.client.get("/health").json(), {"status": "ok"})

    def test_analyze_matches_and_gaps(self):
        res = self.client.post(
            "/api/v1/analyze", {"job_description": JD, "resume_text": RESUME}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        body = res.json()

        statuses = {r["name"]: r["evidence_status"] for r in body["requirements"]}
        self.assertEqual(statuses["React"], "clearly_supported")
        self.assertEqual(statuses["Kubernetes"], "not_found")
        self.assertEqual([g["requirement"] for g in body["gaps_to_confirm"]], ["Kubernetes"])
        self.assertEqual([r["action"] for r in body["recommendations"]], ["keep", "de_emphasize"])

    def test_analyze_rejects_empty_input(self):
        res = self.client.post(
            "/api/v1/analyze", {"job_description": "", "resume_text": RESUME}, format="json"
        )
        self.assertEqual(res.status_code, 400)
