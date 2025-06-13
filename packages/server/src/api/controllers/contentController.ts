import { Request, Response, NextFunction } from 'express';
import EnneagramType from '../../models/EnneagramType';
import Wing from '../../models/Wing';
import Arrow from '../../models/Arrow';
import OperatingState from '../../models/OperatingState';
import InstinctualStacking from '../../models/InstinctualStacking';
import mongoose from 'mongoose';


export const getAllEnneagramTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const types = await EnneagramType.find({}).sort({ number: 1 });
    if (!types || types.length === 0) {
      return res.status(404).json({ message: 'No Enneagram Types found.' });
    }
    res.status(200).json(types);
  } catch (error) {
    next(error);
  }
};

export const getEnneagramTypeByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { typeNumber } = req.params;
    const type = await EnneagramType.findOne({ number: parseInt(typeNumber, 10) });
    if (!type) {
      return res.status(404).json({ message: `Enneagram Type ${typeNumber} not found.` });
    }
    res.status(200).json(type);
  } catch (error) {
    next(error);
  }
};

export const getWingsForType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { typeNumber } = req.params;
    const primaryEnneagramType = await EnneagramType.findOne({ number: parseInt(typeNumber, 10) });
    if (!primaryEnneagramType) {
      return res.status(404).json({ message: `Enneagram Type ${typeNumber} not found to retrieve wings for.` });
    }

    const wings = await Wing.find({ primaryType: primaryEnneagramType._id })
                            .populate('wingType', 'number name nickname colorHex'); // Populate the wingType field

    if (!wings || wings.length === 0) {
      return res.status(404).json({ message: `No Wings found for Enneagram Type ${typeNumber}.` });
    }
    res.status(200).json(wings);
  } catch (error) {
    next(error);
  }
};

export const getArrowsForType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { typeNumber } = req.params;
    const arrow = await Arrow.findOne({ typeNumber: parseInt(typeNumber, 10) });
    if (!arrow) {
      return res.status(404).json({ message: `Arrow information for Enneagram Type ${typeNumber} not found.` });
    }
    res.status(200).json(arrow);
  } catch (error) {
    next(error);
  }
};

export const getAllOperatingStates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const states = await OperatingState.find({});
    if (!states || states.length === 0) {
      return res.status(404).json({ message: 'No Operating States found.' });
    }
    res.status(200).json(states);
  } catch (error) {
    next(error);
  }
};

export const getAllInstinctualStackings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stackings = await InstinctualStacking.find({});
    if (!stackings || stackings.length === 0) {
      return res.status(404).json({ message: 'No Instinctual Stackings found.' });
    }
    res.status(200).json(stackings);
  } catch (error) {
    next(error);
  }
};
