# RoleFit

Every resume, tailored to the role. See `rolefit_project_details.md` for the full spec.

```
extension/   Chrome MV3 extension — React + TypeScript + Vite (side panel UI)
backend/     Django + Django REST Framework — analysis API (currently a keyword-matching mock)
```

## Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 8000    # http://localhost:8000/health
python manage.py test
```

## Extension

```bash
cd extension
npm install
npm run build      # outputs to extension/dist
npm run dev        # rebuilds on change
npm test
```

Load it in Chrome: `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `extension/dist`.
Click the RoleFit toolbar icon to open the side panel. After rebuilding, hit the reload icon on the extension card.

## Current flow (milestone 1)

1. Open a job posting → **Extract from page** (or paste the JD).
2. Paste resume text → **Analyze** (calls `POST /api/v1/analyze`).
3. Review recommendations → Accept / Reject / Undo.

## Next steps

- Replace `backend/app/services/analyzer.py` with an LLM call using structured output, validated by `analysis/serializers.py`.
- PDF resume upload and section parsing (`POST /api/v1/resumes/parse`).
- Resume preview + PDF/LaTeX export.
- Add token auth + rate limiting before deploying the API publicly.
- Persist resumes locally via `chrome.storage.local`.

The API contract lives in `backend/analysis/serializers.py` and is mirrored in `extension/src/types.ts`.
