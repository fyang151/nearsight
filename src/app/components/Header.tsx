const Header = ({ currentPage }: { currentPage?: string }) => {
  return (
    <div className="flex items-center justify-between p-2">
      <h1 className="hidden sm:block text-3xl">Nearsight.cc</h1>
      <div>
        <a
          href="/"
          className={`text-lg mr-4 ${currentPage === "random" ? "italic" : ""}`}
        >
          Random
        </a>
        <a
          href="/list"
          className={`text-lg mr-4 ${currentPage === "list" ? "italic" : ""}`}
        >
          List
        </a>
      </div>
    </div>
  );
};

export default Header;
