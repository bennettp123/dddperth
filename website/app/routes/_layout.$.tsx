/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HeadersFunction, LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/react'
import { Link, useLoaderData } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import getConferenceActions from '~/lib/conference-actions'
import { ConferenceState } from '~/lib/config-types'
import { CACHE_CONTROL } from '~/lib/http.server'
import { css } from '../../styled-system/css'
import { Box, styled } from '../../styled-system/jsx'
import { conferenceConfig } from '../config/conference-config'
import { socials } from '../config/socials'
import { renderMdx } from '../lib/mdx-render.server'
import { getPage } from '../lib/mdx.server'

export async function loader({ params, request, context }: LoaderFunctionArgs) {
    const contentSlug = params['*']
    if (!contentSlug) {
        throw new Error('Expected contentSlug param')
    }
    const requestUrl = new URL(request.url)
    const siteUrl = requestUrl.protocol + '//' + requestUrl.host

    const post = getPage(contentSlug)
    const currentPath = requestUrl.pathname

    return json(
        {
            currentPath,
            siteUrl,
            frontmatter: post.frontmatter,
            post: renderMdx(post.Component, context.conferenceState),
            conferenceState: context.conferenceState,
        },
        { headers: { 'Cache-Control': CACHE_CONTROL.DEFAULT } },
    )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    // Inherit the caching headers from the loader so we don't cache 404s
    return loaderHeaders
}

export const meta: MetaFunction<typeof loader> = (args) => {
    const { data, params } = args
    const contentSlug = params['*']
    if (!contentSlug) {
        throw new Error('Expected contentSlug param')
    }

    const { siteUrl, post, frontmatter } = data || {}
    if (!post || !frontmatter) {
        return [{ title: `404 Not Found | ${conferenceConfig.name}` }]
    }

    const ogImageUrl = siteUrl ? new URL(`${siteUrl}/img/${contentSlug}`) : null
    if (ogImageUrl) {
        ogImageUrl.searchParams.set('title', frontmatter.title)
    }

    const socialImageUrl = ogImageUrl?.toString()
    const url = siteUrl ? `${siteUrl}/blog/${contentSlug}` : null

    return [
        { title: `${frontmatter.title} | ${conferenceConfig.name}` },
        { name: 'description', content: frontmatter.summary },
        { property: 'og:url', content: url },
        { property: 'og:title', content: frontmatter.title },
        { property: 'og:image', content: socialImageUrl },
        { property: 'og:description', content: frontmatter.summary },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: `@${socials.Twitter.Name}` },
        { name: 'twitter:site', content: `@${socials.Twitter.Name}` },
        { name: 'twitter:title', content: frontmatter.title },
        { name: 'twitter:description', content: frontmatter.summary },
        { name: 'twitter:image', content: socialImageUrl },
        // {
        //     name: 'twitter:image:alt',
        //     // content: socialImageUrl ? post.imageAlt : undefined,
        // },
    ]
}

export default function WebsiteContentPage() {
    const { post, frontmatter, currentPath, conferenceState, siteUrl } = useLoaderData<typeof loader>()

    return (
        <>
            {frontmatter.draft ? (
                <div>🚨 This is a draft, please do not share this page until it&apos;s officially published 🚨</div>
            ) : null}
            <div>
                <Box position="relative" bg="white" w="100%" display="flex" color="2023-green">
                    <Box w="100%" position="relative" maxW="1200px" m="0 auto" md={{ p: '4' }}>
                        <ContentPageWithSidebar
                            currentPath={currentPath}
                            siteUrl={siteUrl}
                            frontmatter={frontmatter}
                            post={post}
                            conferenceState={conferenceState}
                        />
                    </Box>
                </Box>
            </div>
        </>
    )
}

export const styledSidebarContainer = css({
    display: 'table',
    tableLayout: 'fixed',
    marginTop: 'xl',
    marginBottom: 'xl',

    ['@supports(display: grid)']: {
        display: 'grid',
        gridGap: 'md',

        md: {
            gridTemplateColumns: 'minmax(1rem, 1fr) minmax(0, 90ch) minmax(0, 30ch) minmax(1rem, 1fr)',

            '&main': {
                gridColumn: 2,
            },

            '&aside': {
                gridColumn: 3,
            },
        },
    },
})

function ContentPageWithSidebar({ frontmatter, post, currentPath, conferenceState }: SerializeFrom<typeof loader>) {
    return (
        <div className={styledSidebarContainer}>
            <styled.h1 fontSize="3xl">{frontmatter.title}</styled.h1>
            <main id="content" dangerouslySetInnerHTML={{ __html: post }} />
            <aside>
                <EventDetailsSummary conferenceState={conferenceState} currentPath={currentPath} />
                <h2>Important Dates</h2>
                {/* TODO Important date list */}
                {/* <ImportantDatesList layout="inline" conference={conference} currentDate={currentDate} /> */}
            </aside>
        </div>
    )
}

export interface EventDetailsSummaryProps {
    conferenceState: SerializeFrom<ConferenceState>
    currentPath: string
    className?: string
}

export const EventDetailsSummary = ({ className, conferenceState, currentPath }: EventDetailsSummaryProps) => {
    const [primaryCta] = getConferenceActions(conferenceState).filter((a) => a.url !== currentPath)

    const relevantDate = conferenceState.conference.date

    return (
        <div className={className}>
            {relevantDate ? (
                <h2>
                    <small style={{ display: 'block' }}>
                        {conferenceState.conferenceState === 'before-conference' ? 'Next event' : 'Previous event'}
                    </small>
                    <time>{new Date(relevantDate).toDateString()}</time>
                </h2>
            ) : null}
            <ul
                className={css({
                    paddingLeft: 'md',
                    marginBottom: 'lg',
                    marginLeft: 'lg',

                    '&li': {
                        paddingLeft: 'xs',
                        fill: '2023-pink',
                        listStyleImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 0h6v6H0z'/%3E%3C/svg%3E")`,
                        listStyleType: 'none',
                    },
                })}
            >
                {conferenceState.ticketSales === 'sold-out' && (
                    <li>
                        <strong>SOLD OUT</strong>
                    </li>
                )}
                {conferenceState.ticketSales === 'wait-list-open' && (
                    <li>
                        <strong>WAITLIST OPEN</strong>
                    </li>
                )}
                {/* {conference.SellingPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                ))} */}
                <li>Only {conferenceState.conference.ticketPrice}</li>
            </ul>
            {primaryCta && (
                <div style={{ textAlign: 'center' }}>
                    <Button asChild>
                        <Link to={primaryCta.url}>{primaryCta.title}</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
