from django.urls import path

from . import views

urlpatterns = [
    path("health", views.health, name="health"),
    path("api/v1/analyze", views.analyze, name="analyze"),
]
