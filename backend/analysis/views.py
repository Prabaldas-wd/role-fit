from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from . import services
from .serializers import AnalyzeRequestSerializer, AnalyzeResponseSerializer


@api_view(["GET"])
def health(request: Request) -> Response:
    return Response({"status": "ok"})


@api_view(["POST"])
def analyze(request: Request) -> Response:
    req = AnalyzeRequestSerializer(data=request.data)
    req.is_valid(raise_exception=True)

    result = services.analyze(**req.validated_data)

    # Validate the analyzer's output before returning it; this matters once
    # the analyzer is an LLM that may return malformed data.
    res = AnalyzeResponseSerializer(data=result)
    res.is_valid(raise_exception=True)
    return Response(res.validated_data)
