'use strict';

let sheet1 = new MusicSheet(1/4, {
    // === 01 000 - 015 === //
      0: [[snd1, 3, NOTE.DO], [snd1, 2, NOTE.SOL]],
      4: [[snd1, 2, NOTE.SI]],
      8: [[snd1, 2, NOTE.LA]],
     12: [[snd1, 3, NOTE.DO], [snd1, 2, NOTE.SOL]],
    // === 02 016 - 031 === //
     16: [[snd1, 2, NOTE.SI]],
     18: [[snd1, 2, NOTE.SOL]],
     22: [[snd1, 3, NOTE.SOL]],
     24: [[snd1, 2, NOTE.SOL]],
     26: [[snd1, 2, NOTE.DO]],
     28: [[snd1, 2, NOTE.DO]],
     30: [[snd1, 2, NOTE.DO]],
    // === 03 032 - 047 === //
     32: [[snd1, 3, NOTE.DO], [snd1, 2, NOTE.SOL]],
     36: [[snd1, 2, NOTE.SI]],
     40: [[snd1, 2, NOTE.LA]],
     44: [[snd1, 2, NOTE.LA], [snd1, 2, NOTE.MI]],
    // === 04 048 - 063 === //
     48: [[snd1, 2, NOTE.RE]],
     50: [[snd1, 2, NOTE.DO]],
     52: [[snd1, 3, NOTE.DO]],
     54: [[snd1, 2, NOTE.DO]],
     56: [[snd1, 1, NOTE.LA]],
     58: [[snd1, 1, NOTE.LA]],
     60: [[snd1, 1, NOTE.LA]],
    // === 05 064 - 079 === //
     64: [[snd1, 1, NOTE.DO], [snd1, 2, NOTE.SOL]],
     68: [[snd1, 1, NOTE.DO], [snd1, 3, NOTE.DO]],
     70: [[snd1, 2, NOTE.SOL]],
     72: [[snd1, 1, NOTE.DO], [snd1, 3, NOTE.SOL]],
     74: [[snd1, 3, NOTE.FA]],
     76: [[snd1, 1, NOTE.DO], [snd1, 3, NOTE.SOL]],
     78: [[snd1, 3, NOTE.FA]],
    // === 06 080 - 095 === //
     80: [[snd1, 3, NOTE.MI], [snd1, 1, NOTE.MI]],
     82: [[snd1, 3, NOTE.RE]],
     84: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
     86: [[snd1, 3, NOTE.SOL]],
     88: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
     92: [[snd1, 1, NOTE.MI]],
     94: [[snd1, 3, NOTE.SI]],
    // === 07 096 - 111 === //
     96: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.LA]],
     98: [[snd1, 3, NOTE.SOL]],
    100: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.LA]],
    102: [[snd1, 3, NOTE.DO]],
    104: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.LA]],
    108: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.MI]],
    110: [[snd1, 3, NOTE.MI]],
    // === 08 112 - 127 === //
    112: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.RE]],
    114: [[snd1, 3, NOTE.MI]],
    116: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SOL]],
    120: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SI]],
    124: [[snd1, 1, NOTE.SOL], [snd1, 4, NOTE.SOL]],
    // === 09 128 - 143 === //
    128: [[snd1, 1, NOTE.DO], [snd1, 4, NOTE.DO]],
    132: [[snd1, 1, NOTE.DO], [snd1, 3, NOTE.DO]],
    134: [[snd1, 3, NOTE.MI]],
    136: [[snd1, 1, NOTE.DO]],
    138: [[snd1, 4, NOTE.DO]],
    140: [[snd1, 1, NOTE.DO]],
    142: [[snd1, 3, NOTE.DO]],
    // === 10 144 - 159 === //
    144: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
    148: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.SOL]],
    152: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.SI]],
    154: [[snd1, 4, NOTE.MI]],
    156: [[snd1, 1, NOTE.MI], [snd1, 4, NOTE.RE]],
    158: [[snd1, 3, NOTE.SI]],
    // === 11 160 - 175 === //
    160: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.LA]],
    162: [[snd1, 3, NOTE.SI]],
    164: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.DO]],
    166: [[snd1, 4, NOTE.MI]],
    168: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.FA]],
    170: [[snd1, 4, NOTE.SOL]],
    172: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.LA]],
    // === 12 176 - 191 === //
    176: [[snd1, 1, NOTE.SOL], [snd1, 4, NOTE.SOL]],
    178: [[snd1, 4, NOTE.FA]],
    180: [[snd1, 1, NOTE.SOL], [snd1, 4, NOTE.RE]],
    182: [[snd1, 3, NOTE.SI]],
    184: [[snd1, 1, NOTE.SOL]],
    186: [[snd1, 3, NOTE.SOL]],
    188: [[snd1, 1, NOTE.SOL]],
    190: [[snd1, 3, NOTE.SI]],
    // === 13 192 - 207 === //
    192: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.LA]],
    196: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.SOL]],
    200: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.MI]],
    204: [[snd1, 1, NOTE.LA], [snd1, 3, NOTE.DO]],
    // === 14 208 - 223 === //
    208: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SOL]],
    210: [[snd1, 4, NOTE.SOL]],
    212: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SOL]],
    214: [[snd1, 4, NOTE.SOL]],
    216: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SOL]],
    218: [[snd1, 4, NOTE.SOL]],
    220: [[snd1, 1, NOTE.SOL], [snd1, 3, NOTE.SOL]],
    222: [[snd1, 4, NOTE.SOL]],
    // === 15 224 - 239 === //
    224: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
    226: [[snd1, 4, NOTE.MI]],
    228: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
    230: [[snd1, 4, NOTE.MI]],
    232: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
    234: [[snd1, 4, NOTE.MI]],
    236: [[snd1, 1, NOTE.MI], [snd1, 3, NOTE.MI]],
    238: [[snd1, 4, NOTE.MI]],
    // === 16 240 - 255 === //
    240: [[snd1, 1, NOTE.FA], [snd1, 3, NOTE.FA]],
    242: [[snd1, 3, NOTE.SOL]],
    244: [[snd1, 1, NOTE.FA], [snd1, 3, NOTE.LA]],
    248: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.DO]],
    250: [[snd1, 3, NOTE.FA]],
    252: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.DO]],
    254: [[snd1, 4, NOTE.DO]],
    // === 17 256 - 271 === //
    256: [[snd1, 1, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    258: [[snd1, 1, NOTE.RE]],
    260: [[snd1, 1, NOTE.MI], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 3, NOTE.SOL]],
    262: [[snd1, 1, NOTE.DO]],
    264: [[snd1, 1, NOTE.SOL], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    266: [[snd1, 1, NOTE.SOL]],
    268: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.SI],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    270: [[snd1, 1, NOTE.DO]],
    // === 18 272 - 287 === //
    272: [[snd1, 1, NOTE.RE], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    274: [[snd1, 1, NOTE.MI]],
    276: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.DO]],
    278: [[snd1, 1, NOTE.RE]],
    280: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.RE],
          [snd1, 3, NOTE.FA], [snd1, 3, NOTE.LA]],
    282: [[snd1, 1, NOTE.LA]],
    284: [[snd1, 2, NOTE.RE], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    286: [[snd1, 1, NOTE.RE]],
    // === 19 288 - 303 === //
    288: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    290: [[snd1, 1, NOTE.SOL]],
    292: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.SI],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    294: [[snd1, 1, NOTE.FA]],
    296: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    298: [[snd1, 2, NOTE.DO]],
    300: [[snd1, 2, NOTE.FA], [snd1, 4, NOTE.DO],
          [snd1, 3, NOTE.FA], [snd1, 3, NOTE.LA]],
    302: [[snd1, 1, NOTE.FA]],
    // === 20 304 - 319 === //
    304: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 3, NOTE.LA]],
    306: [[snd1, 1, NOTE.SI]],
    308: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.LA]],
    310: [[snd1, 1, NOTE.LA]],
    312: [[snd1, 2, NOTE.MI], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    314: [[snd1, 2, NOTE.MI]],
    316: [[snd1, 2, NOTE.LA], [snd1, 4, NOTE.DO],
          [snd1, 3, NOTE.LA], [snd1, 4, NOTE.FA]],
    318: [[snd1, 1, NOTE.LA]],
    // === 21 320 - 335 === //
    320: [[snd1, 1, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    322: [[snd1, 1, NOTE.RE]],
    324: [[snd1, 1, NOTE.MI], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 3, NOTE.SOL]],
    326: [[snd1, 1, NOTE.DO]],
    328: [[snd1, 1, NOTE.SOL], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    330: [[snd1, 1, NOTE.SOL]],
    332: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.SI],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    334: [[snd1, 1, NOTE.DO]],
    // === 22 336 - 351 === //
    336: [[snd1, 1, NOTE.RE], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    338: [[snd1, 1, NOTE.MI]],
    340: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.DO]],
    342: [[snd1, 1, NOTE.RE]],
    344: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.RE],
          [snd1, 3, NOTE.FA], [snd1, 3, NOTE.LA]],
    346: [[snd1, 1, NOTE.LA]],
    348: [[snd1, 2, NOTE.RE], [snd1, 4, NOTE.RE],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    350: [[snd1, 1, NOTE.RE]],
    // === 23 352 - 367 === //
    352: [[snd1, 1, NOTE.FA], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    354: [[snd1, 1, NOTE.SOL]],
    356: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.SI],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    358: [[snd1, 1, NOTE.FA]],
    360: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.FA], [snd1, 4, NOTE.LA]],
    362: [[snd1, 2, NOTE.DO]],
    364: [[snd1, 2, NOTE.FA], [snd1, 4, NOTE.DO],
          [snd1, 3, NOTE.FA], [snd1, 3, NOTE.LA]],
    366: [[snd1, 1, NOTE.FA]],
    // === 24 368 - 383 === //
    368: [[snd1, 1, NOTE.LA], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.LA]],
    370: [[snd1, 1, NOTE.SI]],
    372: [[snd1, 2, NOTE.DO], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 3, NOTE.LA]],
    374: [[snd1, 1, NOTE.LA]],
    376: [[snd1, 2, NOTE.MI], [snd1, 4, NOTE.DO],
          [snd1, 4, NOTE.MI], [snd1, 4, NOTE.SOL]],
    378: [[snd1, 2, NOTE.MI]],
    380: [[snd1, 2, NOTE.LA], [snd1, 3, NOTE.SOL],
          [snd1, 4, NOTE.DO], [snd1, 4, NOTE.FA]],
    382: [[snd1, 1, NOTE.LA]],
    383: []
});
let music1 = new Music(sheet1, 120);