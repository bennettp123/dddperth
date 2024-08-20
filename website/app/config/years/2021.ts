import { DateTime } from 'luxon'
import { ConferenceYear } from '../../lib/config-types'

export const conference2021: ConferenceYear = {
    year: '2021',
    conferenceDate: DateTime.fromISO('2021-08-14'),
    ticketPrice: '$60',
    sessionizeUrl: 'https://sessionize.com/ddd-perth-2021',

    venue: undefined,

    sessions: {
        kind: 'sessionize',
        sessionizeEndpoint: 'https://sessionize.com/api/v2/tj9fupmc',
    },

    agendaPublishedDateTime: undefined,
    cfpDates: undefined,
    feedbackOpenUntilDateTime: undefined,
    talkVotingDates: undefined,
    ticketSalesDates: undefined,

    sponsors: {
        platinum: [
            {
                name: 'Valrose',
                logoUrl: '/images/sponsors/2021-valrose.png',
                website: 'https://valrose.com.au/',
            },
            {
                name: 'Telstra Purple',
                logoUrl: '/images/sponsors/2021-telstra-purple.png',
                website: 'https://purple.telstra.com/',
            },
        ],
        gold: [
            {
                name: 'Octopus Deploy',
                logoUrl: '/images/sponsors/2021-octopus-deploy.png',
                website: 'https://octopus.com/',
            },
            {
                name: 'VIX',
                logoUrl: '/images/sponsors/2021-vix.png',
                website: 'https://www.vixtechnology.com/',
            },
            {
                name: 'Virtual Gaming Worlds',
                logoUrl: '/images/sponsors/2021-vgw.png',
                website: 'https://www.vgw.co/',
            },
            {
                name: 'Imdex',
                logoUrl: '/images/sponsors/2021-imdex.png',
                website: 'https://www.imdexlimited.com/',
            },
            {
                name: 'Insight',
                logoUrl: '/images/sponsors/2021-insight.png',
                website: 'https://au.insight.com/',
            },
            {
                name: 'Amazon Web Services',
                logoUrl: '/images/sponsors/2021-aws.png',
                website: 'https://aws.amazon.com/',
            },
            {
                name: 'Microsoft',
                logoUrl: '/images/sponsors/2021-microsoft.png',
                website: 'https://www.microsoft.com/en-au/',
            },
        ],
    },
}