import type { Post, WPPost, Categories, Tags, Category } from "./types"
const domain = import.meta.env.WP_DOMAIN
const isProd = import.meta.env.MODE === "production"
const apiUrl = isProd ? domain : `${domain}/wp-json/wp/v2`

export const getPageInfo = async (slug: string) => {
    const response = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`)
    if (!response.ok) {
        console.error(response)
        return null
    }

    const [data] = await response.json()
    const { title: { rendered: title }, content: { rendered: content } } = data

    // const featuredImage = data._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""

    let featuredImage = "";
     // 1) Intentar con jetpack_featured_media_url (en caso de que exista en algún plan)
    if (data.jetpack_featured_media_url) {
        featuredImage = data.jetpack_featured_media_url;
    }

    // 2) Si no existe, y hay un ID de media, hacer fetch extra al endpoint /media/{id}
    else if (data.featured_media) {
        try {
        const mediaRes = await fetch(`${apiUrl}/media/${data.featured_media}`);
        if (mediaRes.ok) {
            const media = await mediaRes.json();
            featuredImage = media.source_url || "";
        } else {
            console.error("Failed to fetch media for page:", slug, mediaRes.status);
        }
        } catch (err) {
        console.error("Error fetching media:", err);
        }
    }

    return { title, content, featuredImage }
}

export const getAllPostsSlugs = async () => {
    const response = await fetch(`${apiUrl}/posts?per_page=100`)
    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()
    if (!results.length) {
        console.error("No posts found")
        return null
    }

    const slugs = results.map((post: Post) => post.slug)

    return slugs
}

export const getAllPostsCategory = async () => {
    const response = await fetch(`${apiUrl}/categories?per_page=100`)
    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()
    if (!results.length) {
        console.error("No categories found")
        return null
    }

    const categories = results.map((category: Category) => {
        const { id, slug, name } = category

        return { id, slug, name }
    })

    return categories
}

export const getAllPostsTags = async () => {
    const response = await fetch(`${apiUrl}/tags?per_page=100`)
    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()
    if (!results.length) {
        console.error("No tags found")
        return null
    }

    const tags = results.map((tag: Category) => {
        const { id, slug, name } = tag

        return { id, slug, name }
    })

    return tags
}

export const getPostInfo = async (slug: string) => {
    const response = await fetch(`${apiUrl}/posts?slug=${slug}&_embed`)
    if (!response.ok) {
        console.error(response)
        return null
    }

    const [data] = await response.json()
    const { date, title: { rendered: title }, content: { rendered: content } } = data

    let featuredImage: string;

    if (data.jetpack_featured_media_url) {
        featuredImage = data.jetpack_featured_media_url;
    }else{
        featuredImage = data._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""
    }
    // const featuredImage = data._embedded['wp:featuredmedia'][0].source_url
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
    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()
    if (!results.length) {
        console.error("No posts found")
        return null
    }

    const posts = results.map((post: WPPost) => {
        const {
            title: { rendered: title },
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug
        } = post

        let featuredImage: string;

        if (post.jetpack_featured_media_url) {
            featuredImage = post.jetpack_featured_media_url;
        }else{
            featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ""
        }

        return { title, excerpt, content, date, slug, featuredImage }
    })

    return posts
}

export const getPostsByCategory = async ({ perPage = 10 }: { perPage?: number } = {}, { categoryIds }: {categoryIds: number[]}) => {
    const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&categories=${categoryIds.join(",")}&_embed`)

    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()

    if (!results.length) {
        console.error("No Posts found")
        return null
    }

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

    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()

    if (!results.length) {
        console.error("No Posts found")
        return null
    }

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
    if (!response.ok) {
        console.error(response)
        return null
    }

    const results = await response.json()
    if (!results.length) {
        console.error("No posts found")
        return null
    }

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