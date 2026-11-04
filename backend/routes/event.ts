import { Router } from "express";
import { createEvent } from "../controller/event.controller.ts";

const eventRoute = Router();

eventRoute.post("/", createEvent);

export default eventRoute;
