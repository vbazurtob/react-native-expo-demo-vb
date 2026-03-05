/*
 * Personal License Agreement
 * Copyright Notice
 *
 * © 2026 Voltaire Bazurto Blacio. All rights reserved.
 * License Terms
 *
 *     Ownership: All code contained in this portfolio is the sole property of Voltaire Bazurto Blacio and is hereby copyrighted by me.
 *
 *     Permitted Use: Others are welcome to view and study the code for personal, educational, or non-commercial purposes. You may share insights or information about the code, but you cannot use it for any commercial products, either as-is or in a derivative form.
 *
 *     Restrictions: The code may not be used, reproduced, or distributed for commercial purposes under any circumstances without my explicit written permission.
 *
 *     Rights Reserved: I reserve the right to use the code, or any future versions thereof, for my own purposes in any way I choose, including but not limited to the development of future commercial derivative works under my name or personal brand.
 *
 *     Disclaimer: The code is provided "as is" without warranty of any kind, either express or implied. I am not responsible for any damages resulting from the use of this code.
 *
 * By accessing this portfolio, you agree to abide by these terms.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewsArticle } from "@/app/(tabs)/news";

const newsOrigin = "https://www.whitehouse.gov/news/feed/";

// Pure JavaScript RSS/XML parser using regex (no dependencies needed)
function parseRSSFeed(rssText: string): NewsArticle[] {
  const items: NewsArticle[] = [];

  // Match all <item> blocks in the RSS feed
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const itemsMatch = rssText.matchAll(itemRegex);

  for (const itemMatch of itemsMatch) {
    const itemContent = itemMatch[1];

    // Extract title
    const titleMatch = itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").trim()
      : "";

    // Extract link
    const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : "";

    // Extract description
    const descMatch = itemContent.match(
      /<description[^>]*>([\s\S]*?)<\/description>/i,
    );
    const description = descMatch
      ? descMatch[1]
          .replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1")
          .replace(/<[^>]+>/g, "")
          .trim()
      : "";

    // Extract pubDate
    const dateMatch = itemContent.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
    const pubDate = dateMatch ? dateMatch[1].trim() : "";

    if (title) {
      items.push({ title, link, description, pubDate });
    }
  }

  return items;
}

const loadNews = createAsyncThunk(newsOrigin, async (arg) => {
  const response = await fetch(newsOrigin);
  if (response.ok) {
    const rssText = await response.text();
    return parseRSSFeed(rssText);
  } else {
    throw `Failed to load news. HTTP Error: ${response.status}`;
  }
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    articles: [] as NewsArticle[],
    isLoading: false,
    errorLoad: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadNews.pending, (state) => {
      state.articles = [];
      state.isLoading = true;
      state.errorLoad = "";
    });
    builder.addCase(loadNews.rejected, (state, action) => {
      state.isLoading = false;
      state.errorLoad = "Error loading";
    });
    builder.addCase(loadNews.fulfilled, (state, action) => {
      state.articles = action.payload;
      state.isLoading = false;
      state.errorLoad = "";
    });
  },
});

export { newsSlice, loadNews };
