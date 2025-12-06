const PaginationButtons = ({ currentPage, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center mt-4 gap-2">
      <button
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Prev
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default PaginationButtons;
