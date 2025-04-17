
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EventsPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: EventsPaginationProps) => {
  
  // Não mostrar paginação se só tiver uma página
  if (totalPages <= 1) return null;
  
  // Calcular quais páginas mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar a primeira página
      pages.push(1);
      
      // Calcular páginas intermediárias
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajustar para sempre mostrar 3 páginas do meio
      if (startPage === 2) endPage = Math.min(4, totalPages - 1);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
      
      // Adicionar ellipsis se necessário
      if (startPage > 2) {
        pages.push(-1); // Usar -1 como marcador para ellipsis
      }
      
      // Adicionar as páginas intermediárias
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adicionar ellipsis se necessário
      if (endPage < totalPages - 1) {
        pages.push(-2); // Usar -2 como segundo marcador para ellipsis
      }
      
      // Sempre mostrar a última página
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {getPageNumbers().map((page, index) => {
          if (page < 0) { // Ellipsis
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default EventsPagination;
