// backend/src/middleware/validation.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateContactForm = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(1000).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateQuoteForm = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    serviceType: Joi.string().valid('starter', 'business', 'premium', 'ai', 'custom').required(),
    options: Joi.array().items(Joi.string().valid('design', 'maintenance', 'support')).default([]),
    message: Joi.string().max(1000).allow('').default(''),
    estimatedPrice: Joi.number().min(0).required(),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false, // Affiche toutes les erreurs, pas juste la première
    stripUnknown: true // Ignore les champs inconnus
  });

  if (error) {
    return res.status(400).json({ 
      error: error.details[0].message,
      details: error.details 
    });
  }

  next();
};

export const validateBookingForm = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
    message: Joi.string().max(1000).allow(''),
    selectedSlot: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateClientRegistration = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateClientLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateWizardStep = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    step: Joi.number().integer().min(1).max(9).required(),
    data: Joi.object().required(),
    isDraft: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};