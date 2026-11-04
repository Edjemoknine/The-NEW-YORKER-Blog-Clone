import { Router } from "express";
import { createEvent, getEventPosts } from "../controller/event.controller.ts";

const eventRoute = Router();

eventRoute.get("/", getEventPosts);
eventRoute.post("/", createEvent);

export default eventRoute;
