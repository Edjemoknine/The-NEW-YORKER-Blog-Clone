import { Router } from "express";
import { getPostRecommendations } from "../controller/recommendation.controller.ts";

const recommendationRoute = Router();

recommendationRoute.get("/:id/recommendations", getPostRecommendations);

export default recommendationRoute;
