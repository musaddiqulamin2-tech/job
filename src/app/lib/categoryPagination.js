import connectDB from "./mongodb";

/**
 * Builds a database-first, static-fallback pagination loader for a
 * category. When MongoDB is reachable it uses countDocuments() + skip +
 * limit (server-side pagination, never fetches the whole collection); when
 * it is unavailable it falls back to a bundled static array so the site
 * keeps working offline.
 */
export function createCategoryPagination({
  model,
  fallbackPosts,
  getFallbackPage,
  limit,
}) {
  let dbAvailable = null;

  async function loadFromDb(page, l) {
    if (dbAvailable === false) {
      throw new Error("database-unavailable");
    }
    await connectDB();
    const total = await model.countDocuments({ active: true });
    const posts = await model
      .find({ active: true })
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * l)
      .limit(l)
      .lean();
    return { posts, total: Number(total) || 0 };
  }

  return {
    limit,

    async loadPage(page, l = limit) {
      const current = Math.max(1, Number(page) || 1);
      try {
        const data = await loadFromDb(current, l);
        dbAvailable = true;
        return data;
      } catch (error) {
        dbAvailable = false;
        return {
          posts: getFallbackPage(current, l),
          total: fallbackPosts.length,
        };
      }
    },

    async loadTotal() {
      try {
        const { total } = await loadFromDb(1, limit);
        dbAvailable = true;
        return total;
      } catch (error) {
        dbAvailable = false;
        return fallbackPosts.length;
      }
    },

    totalPages(totalPostCount) {
      return Math.max(1, Math.ceil(totalPostCount / limit));
    },
  };
}