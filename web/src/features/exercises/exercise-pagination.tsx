import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export const ExercisePagination: React.FC<{
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  pagination: {
    page: number;
    pages: number;
    hasPrev: boolean;
    hasNext: boolean;
    limit: number;
    total: number;
  };
}> = ({ goToPage, nextPage, prevPage, pagination }) => {
  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => (!pagination.hasPrev ? undefined : prevPage())}
              className={!pagination.hasPrev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
            let pageNum: number;

            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => goToPage(pageNum)}
                  isActive={pagination.page === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => goToPage(pagination.pages)}
                  className="cursor-pointer"
                >
                  {pagination.pages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => (!pagination.hasNext ? undefined : nextPage())}
              className={!pagination.hasNext ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-center text-sm text-gray-600 mt-4">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
        exercises
      </div>
    </>
  );
};
