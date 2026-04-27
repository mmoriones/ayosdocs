const TableOfContents = ({ headings, onItemClick, activeId }) => {
  return (
    <ul className="space-y-1">
      {headings.map((h, index) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}

            onClick={(e) => {
              e.preventDefault();

              const element = document.getElementById(h.id);
              const offset = 80;
              
              element && 
                window.scrollTo({
                  top: element.getBoundingClientRect().top + window.scrollY - offset,
                  behavior: "smooth",
                });
              
              
              if (onItemClick) onItemClick(h.id);
            }}

            className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
              activeId === h.id
                ? "bg-teal-50 text-teal-600 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
            }`}
          >
            <span className="text-gray-300 mr-2 font-medium">
              {String(index + 1).padStart(2, '0')}
            </span>
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default TableOfContents;
