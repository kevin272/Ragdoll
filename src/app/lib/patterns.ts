"use client";

const createSvgUrl = (svgContent: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const loadSkinPattern = (skinId: string, color: string, ctx: CanvasRenderingContext2D): Promise<CanvasPattern | string> => {
  return new Promise((resolve) => {
    let svg = "";
    
    switch(skinId) {
      case "body_wood":
        svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${color}"/><path d="M0 10 Q10 20 40 10 M0 30 Q20 40 40 20" stroke="#8B4513" stroke-width="2" fill="none" opacity="0.4"/></svg>`;
        break;
      case "body_stone":
        svg = `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="30" fill="${color}"/><circle cx="10" cy="10" r="3" fill="#506070"/><circle cx="25" cy="5" r="2" fill="#506070"/><circle cx="5" cy="25" r="4" fill="#506070"/><circle cx="20" cy="20" r="5" fill="#506070"/></svg>`;
        break;
      case "body_galaxy":
        svg = `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="${color}"/><circle cx="10" cy="10" r="1" fill="#fff" opacity="0.8"/><circle cx="30" cy="20" r="2" fill="#FFD700" opacity="0.9"/><circle cx="40" cy="40" r="1.5" fill="#fff" opacity="0.6"/><circle cx="15" cy="35" r="1" fill="#00FFFF" opacity="0.7"/></svg>`;
        break;
      case "body_blueprint":
        svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="${color}"/><path d="M0 20 L20 20 M20 0 L20 20" stroke="#fff" stroke-width="1" opacity="0.3"/></svg>`;
        break;
      case "body_rust":
        svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${color}"/><circle cx="8" cy="8" r="6" fill="#5C2E0B" opacity="0.6"/><circle cx="30" cy="25" r="8" fill="#A0522D" opacity="0.4"/><circle cx="15" cy="35" r="4" fill="#5C2E0B" opacity="0.7"/></svg>`;
        break;
      case "body_forest":
        svg = `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="30" fill="${color}"/><path d="M15 0 L20 15 L10 15 Z" fill="#228B22" opacity="0.5"/><path d="M5 20 L10 30 L0 30 Z" fill="#006400" opacity="0.4"/><path d="M25 15 L30 25 L20 25 Z" fill="#32CD32" opacity="0.3"/></svg>`;
        break;
      case "body_ghost":
        svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="rgba(200,200,200,0.4)"/><path d="M0 20 Q10 0 20 20" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/></svg>`;
        break;
      case "body_rubber":
        svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="${color}"/><circle cx="10" cy="10" r="4" fill="#FF1493" opacity="0.5"/></svg>`;
        break;
      case "body_gold":
        svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${color}"/><path d="M0 40 L40 0" stroke="#FFF8DC" stroke-width="4" opacity="0.6"/><path d="M10 50 L50 10" stroke="#DAA520" stroke-width="2" opacity="0.4"/></svg>`;
        break;
      case "body_crimson":
        svg = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="${color}"/><path d="M10 0 L20 10 L10 20 L0 10 Z" fill="#8B0000" opacity="0.5"/></svg>`;
        break;
      case "body_marble":
        svg = `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="${color}"/><path d="M0 10 Q15 5 20 25 T50 40" stroke="#A9A9A9" stroke-width="1" fill="none" opacity="0.5"/><path d="M10 50 Q20 30 40 10" stroke="#D3D3D3" stroke-width="2" fill="none" opacity="0.4"/></svg>`;
        break;
      case "body_ink":
        svg = `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="30" fill="${color}"/><circle cx="15" cy="15" r="10" fill="#000" opacity="0.8"/><circle cx="5" cy="5" r="3" fill="#222" opacity="0.6"/></svg>`;
        break;
      default: // charcoal
        svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="${color}"/><circle cx="2" cy="2" r="1" fill="#222" opacity="0.3"/><circle cx="7" cy="8" r="1" fill="#666" opacity="0.2"/></svg>`;
        break;
    }

    const img = new Image();
    img.onload = () => {
      const pattern = ctx.createPattern(img, "repeat");
      resolve(pattern || color);
    };
    img.onerror = () => resolve(color); // fallback
    img.src = createSvgUrl(svg);
  });
};
