const iconPath = (slug) => `./programming-logos/${slug}.svg`

export const PROGRAMMING_CARDS = [
  { name: 'JavaScript', slug: 'javascript', color: '#f7df1e' },
  { name: 'Python', slug: 'python', color: '#3776ab' },
  { name: 'Rust', slug: 'rust', color: '#f74c00' },
  { name: 'Go', slug: 'go', color: '#00add8' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178c6' },
  { name: 'Ruby', slug: 'ruby', color: '#cc342d' },
  { name: '.NET', slug: 'dotnet', color: '#512bd4' },
  { name: 'C++', slug: 'cplusplus', color: '#00599c' },
  { name: 'Swift', slug: 'swift', color: '#f05138' },
  { name: 'Kotlin', slug: 'kotlin', color: '#7f52ff' },
  { name: 'Lua', slug: 'lua', color: '#5a5acd' },
  { name: 'PHP', slug: 'php', color: '#777bb4' },
  { name: 'Java', slug: 'openjdk', color: '#ea2d2e' },
  { name: 'Haskell', slug: 'haskell', color: '#5d4f85' },
  { name: 'Elixir', slug: 'elixir', color: '#7e57c2' },
  { name: 'Dart', slug: 'dart', color: '#0175c2' },
  { name: 'React', slug: 'react', color: '#61dafb' },
  { name: 'Scala', slug: 'scala', color: '#dc322f' },
  { name: 'Zig', slug: 'zig', color: '#f7a41d' },
  { name: 'Node.js', slug: 'nodedotjs', color: '#5fa04e' },
  { name: 'Crystal', slug: 'crystal', color: '#b4b4b4' },
  { name: 'Julia', slug: 'julia', color: '#9558b2' },
  { name: 'Erlang', slug: 'erlang', color: '#a90533' },
  { name: 'Clojure', slug: 'clojure', color: '#63b132' },
  { name: 'Perl', slug: 'perl', color: '#39457e' },
  { name: 'OCaml', slug: 'ocaml', color: '#ec6813' },
  { name: 'Angular', slug: 'angular', color: '#dd0031' },
  { name: 'Vue.js', slug: 'vuedotjs', color: '#4fc08d' },
  { name: 'Svelte', slug: 'svelte', color: '#ff3e00' },
  { name: 'Docker', slug: 'docker', color: '#2496ed' },
  { name: 'Git', slug: 'git', color: '#f05032' },
  { name: 'GitHub', slug: 'github', color: '#f0f6fc' },
].map(card => ({ ...card, image: iconPath(card.slug) }))

export function getCardLabel(symbol) {
  return typeof symbol === 'object' && symbol !== null ? symbol.name : String(symbol)
}
