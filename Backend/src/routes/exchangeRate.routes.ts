// routes/exchangeRate.routes.ts
import express from 'express';
import { getRates } from '../controllers/exchangeRate.controller';

const router = express.Router();

// Public route - the storefront needs rates before it can render any price
router.get('/', getRates);

export default router;
