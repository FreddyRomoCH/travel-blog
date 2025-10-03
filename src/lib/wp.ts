import type { Post, WPPost, Categories, Tags, Category } from "./types"
const domain = import.meta.env.WP_DOMAIN
const isProd = import.meta.env.MODE === "production"
const apiUrl = isProd ? domain : `${domain}/wp-json/wp/v2`

export const getPageInfo = async (slug: string) => {
    const response = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`)
    if (!response.ok) throw new Error("Failed to fetch page info")

    const [data] = await response.json()
    const { title: { rendered: title }, content: { rendered: content } } = data

    const featuredImage = data._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

    return { title, content, featuredImage }
}

export const getAllPostsSlugs = async () => {
    const response = await fetch(`${apiUrl}/posts?per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch latest posts")

    const results = await response.json()
    if (!results.length) throw new Error("No posts found")

    const slugs = results.map((post: Post) => post.slug)

    return slugs
}

export const getAllPostsCategory = async () => {
    const response = await fetch(`${apiUrl}/categories?per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch latest posts")

    const results = await response.json()
    if (!results.length) throw new Error("No posts found")

    const categories = results.map((category: Category) => {
        const { id, slug, name } = category

        return { id, slug, name }
    })

    return categories
}

export const getAllPostsTags = async () => {
    const response = await fetch(`${apiUrl}/tags?per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch latest posts")

    const results = await response.json()
    if (!results.length) throw new Error("No posts found")

    const tags = results.map((tag: Category) => {
        const { id, slug, name } = tag

        return { id, slug, name }
    })

    return tags
}

export const getPostInfo = async (slug: string) => {
    const response = await fetch(`${apiUrl}/posts?slug=${slug}&_embed`)
    if (!response.ok) throw new Error("Failed to fetch page info")

    const [data] = await response.json()
    const { date, title: { rendered: title }, content: { rendered: content } } = data

    const featuredImage = data._embedded['wp:featuredmedia'][0].source_url
    const author = data._embedded['author'][0].name
    const categories = data._embedded['wp:term'][0].map((category: Categories) => {
        const {id, name, slug} = category

        return {id, name, slug}
    })
    const tags = data._embedded['wp:term'][1].map((tag: Tags) => {
        const { id, name, slug  } = tag

        return {id, name, slug}
    })

    return { date, title, content, featuredImage, author, categories, tags }
}

export const getLatestPosts = async ({ perPage = 10 }: { perPage?: number } = {}) => {
    const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`)
    if (!response.ok) throw new Error("Failed to fetch latest posts")

    const results = await response.json()
    if (!results.length) throw new Error("No posts found")

    const posts = results.map((post: WPPost) => {
        const {
            title: { rendered: title },
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug
        } = post

        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return posts
}

export const getPostsByCategory = async ({ perPage = 10 }: { perPage?: number } = {}, { categoryIds }: {categoryIds: number[]}) => {
    const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&categories=${categoryIds.join(",")}&_embed`)

    if (!response.ok) throw new Error("Fail to fetch")

    const results = await response.json()

    if (!results.length) throw new Error("No Posts found")

    const posts = results.map((post: WPPost) => {
        const {
            title: { rendered: title },
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug
        } = post

        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return posts
}

export const getPostsByTags = async ({ perPage = 10 }: { perPage?: number } = {}, { tagIds }: {tagIds: number[]}) => {
    const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&tags=${tagIds.join(",")}&_embed`)

    if (!response.ok) throw new Error("Fail to fetch")

    const results = await response.json()

    if (!results.length) throw new Error("No Posts found")

    const posts = results.map((post: WPPost) => {
        const {
            title: { rendered: title },
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug
        } = post

        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return posts
}

export const getAllPosts = async ({ page = 1, perPage = 6 }: {page?:number, perPage?:number}) => {
    const response = await fetch(`${apiUrl}/posts?page=${page}&per_page=${perPage}&_embed`)
    if (!response.ok) throw new Error('Error fetching data')

    const results = await response.json()
    if (!results.length) throw new Error("No posts found")

    const totalPages = Number(response.headers.get("X-WP-TotalPages") || 1)

    const posts = results.map((post: WPPost) => {
        const {
            title: {rendered: title},
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug
        } = post

        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return { posts, totalPages }
}