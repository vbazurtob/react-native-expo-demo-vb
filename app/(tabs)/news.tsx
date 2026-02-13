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

import {useEffect, useState} from "react";
import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import * as Linking from "expo-linking";

type NewsItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

const newsOrigin = "https://www.whitehouse.gov/news/feed/";

// Pure JavaScript RSS/XML parser using regex (no dependencies needed)
function parseRSSFeed(rssText: string): NewsItem[] {
    const items: NewsItem[] = [];

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
            items.push({title, link, description, pubDate});
        }
    }

    return items;
}

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original if parsing fails
        }

        // Format as "Month-Day-Year HH:mm"
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${month}-${day}-${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString; // Return original if formatting fails
    }
}

async function openLink(link: string) {
    try {
        const canOpen = await Linking.canOpenURL(link);
        if (canOpen) {
            await Linking.openURL(link);
        } else {
            console.error(`Cannot open URL: ${link}`);
        }
    } catch (error) {
        console.error(`Error opening URL: ${link}`, error);
    }
}

export default function NewsScreen() {
    const [isLoading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

    async function loadNews() {
        try {
            setLoading(true);
            setLoadError(null);
            const response = await fetch(newsOrigin);
            if (response.ok) {
                const rssText = await response.text();
                const parsedItems = parseRSSFeed(rssText);
                setNewsItems(parsedItems);
            } else {
                setLoadError(`HTTP Error: ${response.status}`);
            }
        } catch (eFetch) {
            console.log(eFetch);
            setLoadError(
                eFetch instanceof Error ? eFetch.message : "Failed to load news",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNews();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText style={styles.headerTitle}>News</ThemedText>
                <TouchableOpacity
                    style={styles.reloadButton}
                    onPress={loadNews}
                    disabled={isLoading}
                >
                    <ThemedText style={styles.reloadButtonText}>
                        {isLoading ? "Loading..." : "Reload"}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
            <ScrollView style={styles.scrollView}>
                {isLoading && (
                    <ThemedView style={styles.newsItem}>
                        <ThemedText style={styles.newsHeader}>Loading news...</ThemedText>
                    </ThemedView>
                )}
                {loadError && (
                    <ThemedView style={styles.newsItem}>
                        <ThemedText style={[styles.newsHeader, {color: "#d32f2f"}]}>
                            An error occurred trying to load the news. {"\n"}
                            Details: {loadError}
                        </ThemedText>
                    </ThemedView>
                )}
                {!isLoading && !loadError && newsItems.length === 0 && (
                    <ThemedView style={styles.newsItem}>
                        <ThemedText style={styles.newsHeader}>
                            No news items found
                        </ThemedText>
                    </ThemedView>
                )}
                {newsItems.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => openLink(item.link)}>
                        <ThemedView style={styles.newsItem}>
                            <ThemedText style={styles.newsHeader}>{item.title}</ThemedText>
                            {item.description && (
                                <ThemedText style={styles.newsDescription} numberOfLines={2}>
                                    {item.description}
                                </ThemedText>
                            )}
                            {item.pubDate && (
                                <ThemedText style={styles.newsDate}>
                                    {formatDate(item.pubDate)}
                                </ThemedText>
                            )}
                        </ThemedView>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        paddingTop: 60,
        backgroundColor: "#f8f9fa",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    reloadButton: {
        backgroundColor: "#4caf50",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 80,
        alignItems: "center",
    },
    reloadButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    newsItem: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    newsHeader: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    newsDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    newsDate: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
});
