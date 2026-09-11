// The original character map is shared by the landing and ANSI terminals.
// Dots are transparent; B is dark fur, W is white fur, Y is the eyes.
export const mascotPixels = [
  "..............................",
  "..............BB...B..........",
  "..............BBBBBB..........",
  ".........B...BBBBBBB.B........",
  ".........B....BBYBBYB.........",
  ".........B...BBBBBBB.B........",
  "..........B....WWWW...........",
  "...........B..BBWWW...........",
  "............BBBBBWB...........",
  "............BBBWBBBW..........",
  "..............................",
  "..............................",
] as const;

export const mascotPalette = {
  // Lift black fur to graphite so the silhouette survives a near-black terminal.
  B: "#716b72",
  W: "#f2eeee",
  Y: "#dfbd62",
} as const;

type Pixel = keyof typeof mascotPalette | ".";
export type MascotCell = {
  glyph: " " | "█" | "▀" | "▄";
  foreground: keyof typeof mascotPalette | null;
  background: keyof typeof mascotPalette | null;
};

function packPixels(top: Pixel, bottom: Pixel): MascotCell {
  if (top === "." && bottom === ".") {
    return { glyph: " ", foreground: null, background: null };
  }
  if (top === ".") {
    return { glyph: "▄", foreground: bottom as keyof typeof mascotPalette, background: null };
  }
  if (bottom === "." || top === bottom) {
    return { glyph: bottom === "." ? "▀" : "█", foreground: top, background: null };
  }
  return { glyph: "▀", foreground: top, background: bottom };
}

function buildMascotRows(): MascotCell[][] {
  // Trim only transparent margins, without altering any of the supplied pixels.
  const points = mascotPixels.flatMap((row, y) =>
    Array.from(row, (pixel, x) => ({ pixel, x, y })).filter(({ pixel }) => pixel !== "."),
  );
  const left = Math.min(...points.map(({ x }) => x));
  const right = Math.max(...points.map(({ x }) => x));
  const top = Math.min(...points.map(({ y }) => y));
  const bottom = Math.max(...points.map(({ y }) => y));
  const rows: MascotCell[][] = [];

  // One terminal character carries two vertical pixels using Unicode half blocks.
  for (let y = top; y <= bottom; y += 2) {
    rows.push(Array.from({ length: right - left + 1 }, (_, column) => {
      const x = left + column;
      return packPixels(
        mascotPixels[y]?.[x] as Pixel ?? ".",
        mascotPixels[y + 1]?.[x] as Pixel ?? ".",
      );
    }));
  }
  return rows;
}

export const mascotRows = buildMascotRows();

/** The same glyphs and palette as real ANSI truecolor output, with no images. */
export function renderMascotAnsi(color = true): string {
  const escape = "\u001b[";
  const rgb = (pixel: keyof typeof mascotPalette) =>
    mascotPalette[pixel].slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16)).join(";");

  return mascotRows.map(row => row.map(cell => {
    if (!color || cell.foreground === null) return cell.glyph;
    const foreground = `${escape}38;2;${rgb(cell.foreground)}m`;
    const background = cell.background ? `${escape}48;2;${rgb(cell.background)}m` : "";
    return `${foreground}${background}${cell.glyph}${escape}0m`;
  }).join("")).join("\n");
}
