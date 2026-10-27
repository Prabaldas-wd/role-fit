"""API contract. Mirrored in extension/src/types.ts — keep the two in sync."""

from rest_framework import serializers

IMPORTANCE = ["required", "preferred"]
EVIDENCE_STATUS = ["clearly_supported", "possibly_supported", "not_found", "ambiguous"]
RECOMMENDATION_ACTION = ["keep", "rewrite", "de_emphasize", "remove", "add_detail"]


class AnalyzeRequestSerializer(serializers.Serializer):
    job_description = serializers.CharField(max_length=20_000)
    resume_text = serializers.CharField(max_length=20_000)
    target_role = serializers.CharField(max_length=200, required=False, allow_blank=True)


class RequirementSerializer(serializers.Serializer):
    name = serializers.CharField()
    importance = serializers.ChoiceField(choices=IMPORTANCE)
    evidence_status = serializers.ChoiceField(choices=EVIDENCE_STATUS)
    resume_evidence = serializers.ListField(child=serializers.CharField(), default=list)


class RecommendationSerializer(serializers.Serializer):
    id = serializers.CharField()
    section = serializers.CharField()
    action = serializers.ChoiceField(choices=RECOMMENDATION_ACTION)
    original_bullet = serializers.CharField()
    suggested_bullet = serializers.CharField(allow_null=True, default=None)
    reason = serializers.CharField()
    related_requirement = serializers.CharField(allow_null=True, default=None)
    supporting_evidence = serializers.ListField(child=serializers.CharField(), default=list)
    requires_confirmation = serializers.BooleanField(default=False)


class GapToConfirmSerializer(serializers.Serializer):
    requirement = serializers.CharField()
    reason = serializers.CharField()


class AnalyzeResponseSerializer(serializers.Serializer):
    requirements = RequirementSerializer(many=True)
    recommendations = RecommendationSerializer(many=True)
    gaps_to_confirm = GapToConfirmSerializer(many=True)
