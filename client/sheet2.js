'use strict';

let sheet2 = new MusicSheet(1/4, (() => {
      let notes = {};
      function note(beat, toAdd) {
            (notes[beat] || (notes[beat] = [])).push(toAdd);
      }

      let mesure = 0;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 2, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 10, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 10, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 14, [snd1, 4, NOTE.RE, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 4, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 4, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 4, NOTE.MI, MOD.FLAT]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 3, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 7, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.SI, MOD.FLAT]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 3, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 7, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 3, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.DO, MOD.NORMAL], [snd1, 2, NOTE.MI, MOD.FLAT], [snd1, 1, NOTE.SI, MOD.FLAT]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 7, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.SI, MOD.FLAT]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 3, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;

      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 10, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.RE, MOD.NORMAL], [snd1, 2, NOTE.FA, MOD.NORMAL], [snd1, 2, NOTE.DO, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 1, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 5, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 7, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 9, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 11, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 13, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.LA, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.DO, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 14, [snd1, 4, NOTE.DO, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.SOL, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 2, NOTE.SI, MOD.FLAT]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.DO, MOD.NORMAL], [snd1, 3, NOTE.MI, MOD.FLAT], [snd1, 3, NOTE.SOL, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.SOL, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 4, [snd1, 4, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 12, [snd1, 4, NOTE.RE, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 2, NOTE.MI, MOD.FLAT]);
      note(mesure * 16 + 6, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 2, NOTE.FA, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 14, [snd1, 2, NOTE.LA, MOD.NORMAL]);

      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 1, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 2, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 3, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);
      note(mesure * 16 + 7, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 3, NOTE.RE, MOD.NORMAL], [snd1, 3, NOTE.FA, MOD.NORMAL], [snd1, 3, NOTE.LA, MOD.NORMAL]);

      for (let index = 0; index < 2; index++)
      {
          note(mesure * 16 + 0, [snd1, 4, NOTE.RE, MOD.NORMAL]);
          note(mesure * 16 + 2, [snd1, 3, NOTE.SI, MOD.FLAT]);
          note(mesure * 16 + 4, [snd1, 3, NOTE.LA, MOD.NORMAL]);
          note(mesure * 16 + 6, [snd1, 3, NOTE.SOL, MOD.NORMAL]);
          note(mesure * 16 + 8, [snd1, 3, NOTE.FA, MOD.NORMAL]);
          note(mesure * 16 + 10, [snd1, 3, NOTE.MI, MOD.FLAT]);
          note(mesure * 16 + 12, [snd1, 3, NOTE.RE, MOD.NORMAL]);
      }

      mesure++;
      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 1, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 3, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 1, NOTE.DO, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.DO, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 1, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);

      mesure++;
      note(mesure * 16 + 0, [snd1, 3, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 4, [snd1, 2, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 8, [snd1, 1, NOTE.RE, MOD.NORMAL]);
      note(mesure * 16 + 12, [snd1, 2, NOTE.RE, MOD.NORMAL]);

      return notes;
})());
let music2 = new Music(sheet2, 160);