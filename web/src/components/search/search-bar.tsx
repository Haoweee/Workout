import { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
  error?: string | null;
  handleRefresh?: () => void;
  placeholder?: string;
  suggestions?: Array<{ id: string | number; name: string }>;
  showDropdown?: boolean;
  onSuggestionClick?: (suggestion: { id: string | number; name: string }) => void;
  className?: string;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSearch,
  isLoading = false,
  error = null,
  handleRefresh,
  placeholder = 'Search...',
  suggestions = [],
  showDropdown = false,
  onSuggestionClick,
  className = '',
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep input focused when dropdown appears
  useEffect(() => {
    if (showDropdown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showDropdown]);

  // Click outside to blur and hide dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error && handleRefresh) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error: {error}</p>
        <button
          onClick={handleRefresh}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`relative flex-1 ${className}`} ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={(el) => {
          inputRef.current = el;
          if (showDropdown && el) {
            el.focus();
          }
        }}
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-4"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute z-10 bg-white border rounded shadow w-full mt-1"
          onMouseDown={(e) => e.preventDefault()} // Prevent dropdown from stealing focus
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              className="flex flex-col w-full items-start px-4 py-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();
                onSuggestionClick?.(suggestion);
              }}
            >
              {suggestion.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
