const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Slots = mongoose.model('slots', new mongoose.Schema({
  sno: {required: true, type: Number},
  isfree: {required: true, type: Boolean},
}));

router.get('/', async (req, res) => {
  const slots = await Slots.find().sort('sno');
  res.send(slots);
});

router.post('/', async (req, res) => {
  const {error} = validateSlots(req.body);
  console.log(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let slots = new Slots({
    sno: req.body.sno,
    isfree: req.body.isfree
  });
  slots = await slots.save();

  res.send(slots);
});

router.put('/:id', async (req, res) => {
  const {error} = validateSlots(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const slots = await Slots.findByIdAndUpdate(req.params.id,
    {
      sno: req.body.sno,
      isfree: req.body.isfree
    }, {new: true});

  if (!slots) return res.status(404).send('The slots with the given ID was not found.');

  res.send(slots);
});

router.delete('/:id', async (req, res) => {
  const slots = await Slots.findByIdAndRemove(req.params.id);

  if (!slots) return res.status(404).send('The slots with the given ID was not found.');

  res.send(slots);
});

router.get('/:id', async (req, res) => {
  const slots = await Slots.findById(req.params.id);

  if (!slots) return res.status(404).send('The slots with the given ID was not found.');

  res.send(slots);
});

function validateSlots(slots) {
  const schema = {
    sno: Joi.number().integer().required(),
    isfree: Joi.boolean().required(),
  };

  return Joi.validate(slots, schema);
}

module.exports = router; 
