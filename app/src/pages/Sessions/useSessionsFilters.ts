import { useState } from 'react';
import { usePagination } from '../../components/ui/Pagination';

const SESSIONS_ITEMS_PER_PAGE = 25;

export function useSessionsFilters(sessions: any[]) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSessions = sessions.filter(s =>
        String(s.id).includes(searchQuery) ||
        (s.nombreusuario || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { page, setPage, totalPages, paginatedItems } = usePagination({
        items: filteredSessions,
        itemsPerPage: SESSIONS_ITEMS_PER_PAGE,
        resetKey: searchQuery,
    });

    return {
        searchQuery,
        setSearchQuery,
        filteredSessions,
        sessionPage: page,
        setSessionPage: setPage,
        totalSessionPages: totalPages,
        paginatedSessions: paginatedItems,
    };
}
