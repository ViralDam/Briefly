import { search } from "arxiv-api";

export const getResearchPapers = (query, start = 0, max = 5) => {
    if(!query) return null;
    return search({
        'searchQueryParams': [
            {
                'include': [
                    {
                        'name': query,
                        'prefix': 'all'
                    }
                ]
            }
        ],
        'start': start,
        'maxResults': max
    });
}