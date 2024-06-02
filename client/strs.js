window.app = window.app || {};

const translatedStrs = {
    en: {
        language: "english",
        tips: {
            jobs:
                `villagers make babies and cut trees
                priests make summons and convert
                warriors fight, builders build`,
            buildings:
                `houses raise the pop limit
                barracks make warriors stronger
                temples raise the summon limit
                and make priests better
                gardens raise the sapling limit
                bridges discover new islands`,
            color:
                `God has changed color!
                Is God the same?`,
            please:
                `God demands pleasing!
                Find out what pleases God!`
        },
        tipsOk: "gotcha",
        msgs: {
            saved: "saved",
            restored: "restored",

            noSpot: {
                message: 'no suitable spot found',
                extra: 'try again or make room'
            },

            builded: {
                message: 'project limit reached',
                extra: 'wait for current projects to complete or conquer more islands'
            },
            noIsland: 'island not owned',
            building: type => `building ${strs.buildings[type.name]}`,
            built: type => `${strs.buildings[type.name]} built`,

            growed: {
                message: 'sapling limit reached',
                extra: 'wait or build more gardens'
            },
            planting: 'tree planted',

            noTree: {
                message: 'no tree to cut',
                extra: 'plant more trees'
            },
            treeNotFound: {
                message: 'tree not found',
                extra: 'try again or plant more trees'
            },
            treeFelled: 'tree felled',
            stumpRemoved: "stump removed",
            treeGrown: "tree grown",

            trained: job => `${strs.jobs[job.name]} trained`,
            villagerNotFound: 'no villager found',

            untrained: job => `${strs.jobs[job.name]} untrained`,
            jobNotFound: job => `no ${strs.jobs[job.name]} untrained`,

            housed: {
                message: 'pop limit reached',
                extra: 'build houses, plant trees, conquer islands or kill people'
            },
            babyMade: 'baby made',
            babyAttempted: {
                message: 'baby attempted',
                extra: 'give villagers more time or make more villagers'
            },

            templed: {
                message: 'pop limit reached',
                extra: 'build more temples'
            },
            summonDone: 'summon successful',
            summonAttempted: {
                message: 'summon attempted',
                extra: 'give priests more time or train more priests'
            },

            praying: 'praying',

            noEnemy: 'no enemy',
            attacking: 'warriors sent',
            converting: 'priests sent',

            noRetreat: 'no one to retreat',
            retreating: 'retreating',

            noSacrifice: 'nobody to sacrifice',
            sacrificing: 'boom!'
        },
        splash: {
            prompt: "Press any key to start",
            promptTouch: "Touch to start"
        },
        menu: {
            resume: "resume",
            tips: "tips",
            tooltips: "tooltips",
            pauseOnFocusLoss: "pause on focus loss",
            music: "music",
            sound: "sound",
            fps: "fps",
            fullscreen: "fullscreen",
            new: "new game",
            save: "save",
            lang: "language",
            restore: "restore",
            source: "source",
            exit: "exit"
        },
        choices: {
            goal: {
                tiny: "tiny",
                short: "short",
                medium: "medium",
                long: "long"
            }
        },
        groups: {
            train: "train",
            build: "build",
            do: "do",
            move: "move"
        },
        jobs: {
            builder: "builder",
            warrior: "warrior",
            priest: "priest"
        },
        buildings: {
            house: "house",
            barracks: "barracks",
            workshop: "workshop",
            temple: "temple",
            greenHouse: "garden",
            bridge: "bridge"
        },
        do: {
            forestate: "forestate",
            deforest: "deforest",
            sacrifice: "sacrifice",
            baby: "baby",
            summon: "summon",
            pray: "pray"
        },
        send: {
            attack: "attack",
            convert: "convert",
            retreat: "retreat"
        }
    },
    fr: {
        language: "français",
        tips: {
            jobs:
                `les villageois bébéisent et coupent les arbres
                les prêtes invoquent et convertissent
                les guerriers se battent
                les artisans batissent`,
            buildings:
                `les maisons augmentent la limite de popuplation
                les barraques rendent les guerriers plus forts
                les temples augmentent la limite d'invocations
                et rendent les prêtres plus forts
                les jardins augmentes la limite de plants
                les ponts découvrent de nouvelles îles`,
            color:
                `Dieu a changé de couleur!
                Est-ce que Dieu est le même?`,
            please:
                `Dieu exige d'être contenté!
                Trouvez ce qui plaît à Dieu!`
        },
        tipsOk: "oué",
        msgs: {
            saved: "sauvegardé",
            restored: "chargé",

            noSpot: {
                message: 'aucun emplacement valide trouvé',
                extra: "essayez à nouveau ou dégagez de l'espace"
            },

            builded: {
                message: 'limite de projets atteinte',
                extra: "attendez que les projets actuels soient complétés, ou conquérez plus d'îles"
            },
            noIsland: 'île non conquise',
            building: type => `construction de ${strs.buildings[type.name]}`,
            built: type => `${strs.buildings[type.name]} construit`,

            growed: {
                message: 'limite de plants atteinte',
                extra: 'attendez ou bâtissez plus de jardins'
            },
            planting: 'arbre planté',

            noTree: {
                message: 'aucun arbre à couper',
                extra: "plantez plus d'arbres"
            },
            treeNotFound: {
                message: 'aucun arbre trouvé',
                extra: "essayez à nouveau ou plantez plus d'arbres"
            },
            treeFelled: 'arbre coupé',
            stumpRemoved: "souche arrachée",
            treeGrown: "arbre poussé",

            trained: job => `${strs.jobs[job.name]} formé`,
            villagerNotFound: 'aucun villageois trouvé',

            untrained: job => `${strs.jobs[job.name]} abruti`,
            jobNotFound: job => `aucun ${strs.jobs[job.name]} trouvé`,

            housed: {
                message: 'limite de population atteinte',
                extra: 'bâtissez des maisons, plantez des arbres, conquérez des îles ou tuez votre populace'
            },
            babyMade: 'bébé créé',
            babyAttempted: {
                message: 'bébé tenté',
                extra: 'donnez plus de temps à vos villageois ou créez plus de villageois'
            },

            templed: {
                message: "limite d'invocations atteinte",
                extra: 'bâtissez plus de temples'
            },
            summonDone: 'invocation réussie',
            summonAttempted: {
                message: 'invocation échouée',
                extra: 'donnez plus de temps à vos prêtres ou formez plus de prêtres'
            },

            praying: 'prière',

            noEnemy: 'aucun enemi',
            attacking: 'guerriers envoyés',
            converting: 'prêtres envoyés',

            noRetreat: 'personne à faire fuir',
            retreating: 'fuite',

            noSacrifice: 'personne à sacrifier',
            sacrificing: 'boom!'
        },
        splash: {
            prompt: "Pesez n'importe quelle touche pour commencer",
            promptTouch: "Touchez pour commencer"
        },
        menu: {
            resume: "résumer",
            tips: "tutoriel",
            tooltips: "infobulles",
            pauseOnFocusLoss: "perte de focus pause",
            music: "musique",
            sound: "son",
            fps: "fps",
            fullscreen: "plein écran",
            new: "nouvelle partie",
            save: "sauvegarder",
            lang: "langue",
            restore: "charger",
            source: "source",
            exit: "quitter"
        },
        choices: {
            goal: {
                tiny: "mini",
                short: "courte",
                medium: "medium",
                long: "longue"
            }
        },
        groups: {
            train: "former",
            build: "bâtir",
            do: "faire",
            move: "bouger"
        },
        jobs: {
            builder: "artisan",
            warrior: "guerrier",
            priest: "prêtre"
        },
        buildings: {
            house: "maison",
            barracks: "barraque",
            workshop: "atelier",
            temple: "temple",
            greenHouse: "jardin",
            bridge: "pont"
        },
        do: {
            forestate: "planter",
            deforest: "couper",
            sacrifice: "sacrifier",
            baby: "bébé",
            summon: "invoquer",
            pray: "prier"
        },
        send: {
            attack: "attaquer",
            convert: "convertir",
            retreat: "fuire"
        }
    }
};

const languages = Object.keys(translatedStrs);
const requestedLanguage = window.app.getLanguage && window.app.getLanguage() || "en";
const defaultLanguage = languages.find(lang => lang === requestedLanguage);
let strs = translatedStrs[defaultLanguage];
