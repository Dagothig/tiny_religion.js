export default {
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
            greenhouses raise the sapling limit
            bridges discover new islands`,
        color:
            `God has changed color!
            Is God the same?`,
        please:
            `God demands pleasing!
            Find out what pleases God!`
    },
    msgs: {
        noSpot: {
            message: 'no suitable spot found',
            extra: 'try again or make room'
        },

        builded: {
            message: 'project limit reached',
            extra: 'wait for current projects to complete or conquer more islands'
        },
        noIsland: 'island not owned',
        building: type => `building ${type.name}`,

        growed: {
            message: 'sapling limit reached',
            extra: 'wait or build more greenshouses'
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

        trained: job => `${job.name} trained`,
        villagerNotFound: 'no villager found',

        untrained: job => `${job.name} untrained`,
        jobNotFound: job => `no ${job.name} untrained`,

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
    }
};