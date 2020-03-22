const express = require('express');
const Video = require('../models/video');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
      let videos = await Video.find({}).limit(100);

      for (let i = videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [videos[i], videos[j]] = [videos[j], videos[i]];
      }

      res.json({
          type: false,
          title: 'OK',
          detail: 'Videos encontrados com sucesso!',
          videos,
      });
  } catch (err) {
      res.status(401).json({
          errors: [{
              type: 'error',
              title: 'ERRO',
              detail: 'Erro inesperado. Contate o administrador do sistema.',
              errorMessage: err.message,
          }, ],
      });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const video = await Video.findOne({ _id: req.params.id});

      res.json({
          type: 'success',
          title: 'OK',
          detail: 'Video encontrado com sucesso.',
          video,
      });
  } catch (err) {
      res.status(401).json({
          errors: [{
              type: 'error',
              title: 'ERRO',
              detail: 'Erro inesperado. Contate o administrador do sistema.',
              errorMessage: err.message,
          }, ],
      });
  }
});

router.post('/', async (req, res) => {
  try {
      let myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
      const videoID = (req.body.url.match(myregexp)) ? RegExp.$1 : '';
      const video = new Video({ url: req.body.url, videoID: videoID});
      const persistedVideo = await video.save();

      res
          .status(201)
          .json({
              type: 'success',
              title: 'OK',
              detail: 'Video cadastrado com sucesso!',
              persistedVideo
          });
  } catch (err) {
      res.status(400).json({
          errors: [{
              type: 'error',
              title: 'ERRO',
              detail: 'Erro inesperado. Contate o administrador do sistema.',
              errorMessage: err.message,
          }, ],
      });
  }
});


router.put('/:id', async (req, res) => {
  try {
      const video = req.body;

      let persistedVideo = await Video.findByIdAndUpdate({ _id: req.params.id}, video);

      res
          .status(201)
          .json({
              type: 'success',
              title: 'OK',
              detail: 'Video alterado com sucesso!',
              persistedVideo
          });
  } catch (err) {
      res.status(400).json({
          errors: [{
              type: 'error',
              title: 'ERRO',
              detail: 'Erro inesperado. Contate o administrador do sistema.',
              errorMessage: err.message,
          }, ],
      });
  }
});


router.delete('/:id', async (req, res) => {
  try {
      const video = await Video.findByIdAndDelete({_id: req.params.id});

      res.json({
          type: 'success',
          title: 'OK',
          detail: 'Video excluído com sucesso!',
          video,
      });
  } catch (err) {
      res.status(401).json({
          errors: [{
              type: 'error',
              title: 'Erro',
              detail: 'Erro inesperado. Contate o administrador do sistema.',
              errorMessage: err.message,
          }, ],
      });
  }
});

module.exports = router;
