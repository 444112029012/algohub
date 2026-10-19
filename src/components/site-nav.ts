export type NavItem = {
  href: string;
  label: string;
};

/** 主要導覽。之後加練習、進度、帳號時，只往這個陣列加項目。 */
export const primaryNav: NavItem[] = [
  { href: "/", label: "目錄" },
  { href: "/cheatsheet", label: "複雜度速查" },
];
