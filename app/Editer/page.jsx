'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { addToCart } from '../lib/cartWishlist';

// Initial default elements for Front and Back sides
const DEFAULT_FRONT_ELEMENTS = [];

const DEFAULT_BACK_ELEMENTS = [];

const FONT_FAMILIES = [
  'Fira Sans',
  'Inter',
  'Roboto',
  'Outfit',
  'Playfair Display',
  'Montserrat',
  'Courier New',
  'Arial'
];

const COLOR_PALETTE = [
  '#2563EB', '#1e3a8a', '#3b82f6', '#0284c7', '#0d9488',
  '#16a34a', '#ca8a04', '#ea580c', '#dc2626', '#9333ea',
  '#475569', '#1e293b', '#000000', '#ffffff', '#f8fafc'
];

const TEMPLATES_LIST = [
  { id: 't-minimal-blue', name: 'Minimal Blue Professional', primaryColor: '#2563EB', bg: '#ffffff', style: 'Corporate' },
  { id: 't-dark-gold', name: 'Executive Dark Gold', primaryColor: '#ca8a04', bg: '#0f172a', style: 'Luxury' },
  { id: 't-emerald-clean', name: 'Modern Emerald Tech', primaryColor: '#10b981', bg: '#f0fdf4', style: 'Tech' },
  { id: 't-rose-creative', name: 'Rose Studio Minimal', primaryColor: '#e11d48', bg: '#fff1f2', style: 'Creative' }
];

const GRAPHICS_SHAPES = [
  { id: 'square', name: 'Square' },
  { id: 'circle', name: 'Circle' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'pentagon', name: 'Pentagon' },
  { id: 'line', name: 'Line' },
  { id: 'arrow', name: 'Arrow' },
  { id: 'double-arrow', name: 'Double Arrow' },
  { id: 'star', name: 'Star' },
  { id: 'speech-bubble-round', name: 'Round Speech Bubble' },
  { id: 'speech-bubble-rect', name: 'Rectangular Speech Bubble' }
];

const renderShapeIcon = (shapeType, fill = '#000000') => {
  switch (shapeType) {
    case 'square':
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-none" />;
    case 'circle':
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-full" />;
    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,5 95,95 5,95" fill={fill} />
        </svg>
      );
    case 'pentagon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,6 95,39 78,94 22,94 5,39" fill={fill} />
        </svg>
      );
    case 'line':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <line x1="18" y1="18" x2="82" y2="82" stroke={fill} strokeWidth="16" strokeLinecap="round" />
        </svg>
      );
    case 'arrow':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 12,38 L 56,38 L 56,18 L 92,50 L 56,82 L 56,62 L 12,62 Z" fill={fill} />
        </svg>
      );
    case 'double-arrow':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 44,18 L 8,50 L 44,82 L 44,62 L 56,62 L 56,82 L 92,50 L 56,18 L 56,38 L 44,38 Z" fill={fill} />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,5 63,35 95,38 71,60 78,92 50,75 22,92 29,60 5,38 37,35" fill={fill} />
        </svg>
      );
    case 'speech-bubble-round':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 55,10 C 76,10 93,27 93,48 C 93,69 76,86 55,86 C 46,86 38,83 31,78 L 15,93 L 22,74 C 18,67 17,58 17,48 C 17,27 34,10 55,10 Z" fill={fill} />
        </svg>
      );
    case 'speech-bubble-rect':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 18,16 L 82,16 C 90,16 95,22 95,30 L 95,66 C 95,74 90,80 82,80 L 38,80 L 22,94 L 25,80 L 18,80 C 10,80 5,74 5,66 L 5,30 C 5,22 10,16 18,16 Z" fill={fill} />
        </svg>
      );
    case 'icon-globe':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="44" fill="none" stroke={fill} strokeWidth="8" />
          <ellipse cx="50" cy="50" rx="20" ry="44" fill="none" stroke={fill} strokeWidth="8" />
          <path d="M 6 50 L 94 50 M 15 25 L 85 25 M 15 75 L 85 75" fill="none" stroke={fill} strokeWidth="6" />
        </svg>
      );
    case 'icon-badge':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="44" fill="none" stroke={fill} strokeWidth="8" />
          <polygon points="25,70 50,45 75,70" fill={fill} />
          <circle cx="35" cy="35" r="8" fill={fill} />
        </svg>
      );
    case 'icon-circle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill={fill} />
          <polygon points="28,70 50,48 72,70" fill="white" />
          <circle cx="36" cy="36" r="7" fill="white" />
        </svg>
      );
    case 'illust-stars':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="35,10 42,30 63,33 46,47 51,68 35,56 19,68 24,47 7,33 28,30" fill={fill} />
          <polygon points="75,40 80,52 93,54 83,63 86,76 75,69 64,76 67,63 57,54 70,52" fill={fill} opacity="0.8" />
        </svg>
      );
    case 'illust-badge':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,6 61,20 78,20 83,36 98,44 93,60 100,75 88,86 86,100 69,96 55,100 45,96 28,100 26,86 14,75 21,60 16,44 31,36 36,20 53,20" fill={fill} />
          <circle cx="57" cy="53" r="28" fill="white" opacity="0.9" />
        </svg>
      );
    case 'illust-diamond':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 88,38 74,90 26,90 12,38" fill={fill} />
          <polygon points="50,10 68,38 50,90 32,38" fill="white" opacity="0.3" />
        </svg>
      );
    default:
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-lg shadow-sm" />;
  }
};

const getCanvasDimensions = (orientationStr = '', sizeStr = '') => {
  const combined = `${sizeStr || ''} ${orientationStr || ''}`;
  const matches = combined.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm)?\s*(?:[xX×*])\s*(\d+(?:\.\d+)?)\s*(?:mm|cm)?/i);

  const isVertical = orientationStr.toLowerCase().includes('vertical');

  if (matches && matches[1] && matches[2]) {
    let w = parseFloat(matches[1]);
    let h = parseFloat(matches[2]);
    if (w > 0 && h > 0) {
      if (isVertical && w > h) {
        const temp = w;
        w = h;
        h = temp;
      } else if (!isVertical && h > w && !combined.toLowerCase().includes('vertical')) {
        // preserve ratio
      }

      const maxDim = 620;
      const aspect = w / h;
      if (w >= h) {
        const calcW = maxDim;
        const calcH = Math.max(200, Math.min(620, Math.round(maxDim / aspect)));
        return { width: `${calcW}px`, height: `${calcH}px` };
      } else {
        const calcH = maxDim;
        const calcW = Math.max(200, Math.min(620, Math.round(maxDim * aspect)));
        return { width: `${calcW}px`, height: `${calcH}px` };
      }
    }
  }

  return isVertical ? { width: '360px', height: '620px' } : { width: '620px', height: '350px' };
};

const getBackgroundStyles = (bgValue) => {
  if (!bgValue || bgValue === 'transparent') {
    return {
      backgroundColor: 'transparent',
      backgroundImage: 'none'
    };
  }
  const isImageOrGradient =
    bgValue.startsWith('http') ||
    bgValue.startsWith('/') ||
    bgValue.startsWith('data:image') ||
    bgValue.startsWith('blob:') ||
    bgValue.startsWith('url(') ||
    bgValue.includes('gradient');

  if (isImageOrGradient) {
    const isDirectUrl =
      bgValue.startsWith('http') ||
      bgValue.startsWith('/') ||
      bgValue.startsWith('data:image') ||
      bgValue.startsWith('blob:');
    return {
      backgroundColor: 'transparent',
      backgroundImage: isDirectUrl ? `url("${bgValue}")` : bgValue,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    };
  }

  return {
    backgroundColor: bgValue,
    backgroundImage: 'none'
  };
};

const renderDesignPreview = (elements = [], background = '#ffffff', corners = '', orientation = '', size = '', maxDim = 380) => {
  const mainDim = getCanvasDimensions(orientation, size);
  const mainW = parseFloat(mainDim.width) || 620;
  const mainH = parseFloat(mainDim.height) || 350;

  const isVertical = orientation.toLowerCase().includes('vertical') || mainH > mainW;
  const scale = isVertical ? (maxDim / mainH) : (maxDim / mainW);
  const previewW = Math.round(mainW * scale);
  const previewH = Math.round(mainH * scale);

  return (
    <div
      style={{
        width: `${previewW}px`,
        height: `${previewH}px`,
        ...getBackgroundStyles(background !== 'transparent' ? background : '#ffffff'),
        borderRadius: corners.includes('Rounded') ? `${Math.max(12, Math.round(24 * (maxDim / 380)))}px` : '0px',
        boxShadow: maxDim >= 300 ? '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)' : '0 4px 10px -2px rgba(0,0,0,0.1)'
      }}
      className={`relative overflow-hidden flex items-center justify-center border border-slate-200/80 transform hover:scale-105 transition-all duration-300 select-none bg-white max-w-[85vw] shrink-0 ${corners.includes('Rounded') ? (maxDim >= 300 ? 'rounded-3xl' : 'rounded-xl') : 'rounded-none'}`}
    >
      {elements.length === 0 ? (
        <span className="text-xs font-bold text-slate-400">No elements</span>
      ) : (
        elements.map((el, idx) => {
          let textShadow = 'none';
          let bgColor = 'transparent';
          let padding = '0px';
          let borderRadius = '0px';

          if (el.effect === 'shadow') {
            const dist = (el.shadowDistance !== undefined ? el.shadowDistance : 10) * scale;
            const angleRad = ((el.shadowAngle !== undefined ? el.shadowAngle : 35) * Math.PI) / 180;
            const offsetX = Math.round(dist * Math.cos(angleRad));
            const offsetY = Math.round(dist * Math.sin(angleRad));
            const blur = (el.shadowBlur !== undefined ? el.shadowBlur : 10) * scale;
            const opacity = (el.shadowOpacity !== undefined ? el.shadowOpacity : 40) / 100;
            const hex = el.shadowColor || '#000000';
            const r = parseInt(hex.slice(1, 3) || '00', 16);
            const g = parseInt(hex.slice(3, 5) || '00', 16);
            const b = parseInt(hex.slice(5, 7) || '00', 16);
            textShadow = `${offsetX}px ${offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;
          } else if (el.effect === 'highlight') {
            const hex = el.highlightColor || '#dbeafe';
            const opacity = (el.highlightOpacity !== undefined ? el.highlightOpacity : 80) / 100;
            const r = parseInt(hex.slice(1, 3) || 'db', 16);
            const g = parseInt(hex.slice(3, 5) || 'ea', 16);
            const b = parseInt(hex.slice(5, 7) || 'fe', 16);
            bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            padding = `${2 * scale}px ${6 * scale}px`;
            borderRadius = `${4 * scale}px`;
          } else if (el.effect === 'glitch') {
            const offset = (el.effectIntensity !== undefined ? el.effectIntensity : 4) * scale;
            textShadow = `-${offset}px 0px 0px #06b6d4, ${offset}px 0px 0px #ec4899`;
          } else if (el.effect === 'echo') {
            const intensity = (el.effectIntensity !== undefined ? el.effectIntensity : 4) * scale;
            textShadow = `${intensity}px ${intensity}px 0px rgba(0,0,0,0.35), ${intensity * 2}px ${intensity * 2}px 0px rgba(0,0,0,0.2), ${intensity * 3}px ${intensity * 3}px 0px rgba(0,0,0,0.1)`;
          }

          const isCurved = el.textShape === 'curve';

          return (
            <div
              key={`preview-el-${el.id || idx}`}
              style={{
                position: 'absolute',
                left: `${(el.x || 0) * scale}px`,
                top: `${(el.y || 0) * scale}px`,
                width: el.width ? `${el.width * scale}px` : 'auto',
                height: el.height ? `${el.height * scale}px` : 'auto',
                zIndex: el.zIndex || 10
              }}
              className="pointer-events-none break-words leading-tight select-none"
            >
              {el.type === 'image' ? (
                <img src={el.url} alt={el.label || 'Image'} className="w-full h-full object-contain rounded-md" />
              ) : el.type === 'svg' ? (
                <div dangerouslySetInnerHTML={{ __html: el.svgContent || '' }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />
              ) : el.type === 'text' ? (
                <div
                  style={{
                    fontSize: el.fontSize ? `${Math.max(6, el.fontSize * scale)}px` : '10px',
                    fontFamily: el.fontFamily || 'Fira Sans',
                    color: el.color || '#0f172a',
                    fontWeight: el.bold ? 'bold' : 'normal',
                    fontStyle: el.italic ? 'italic' : 'normal',
                    textDecoration: el.underline ? 'underline' : 'none',
                    textAlign: el.align || 'left',
                    textTransform: el.textCase || 'none',
                    textShadow: textShadow,
                    backgroundColor: bgColor,
                    padding: padding,
                    borderRadius: borderRadius,
                    lineHeight: 1.25,
                    whiteSpace: 'pre-wrap',
                    transform: isCurved ? `perspective(400px) rotateX(${el.curveRadius !== undefined ? el.curveRadius : 30}deg)` : 'none'
                  }}
                  className="w-full break-words transition-all"
                >
                  {isCurved ? (
                    <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
                      <path id={`preview-curve-${el.id || idx}`} d="M 10,90 Q 150,-20 290,90" fill="transparent" />
                      <text fill={el.color || '#0f172a'} style={{ fontSize: `${Math.max(6, (el.fontSize || 16) * scale)}px`, fontFamily: el.fontFamily || 'Fira Sans', fontWeight: el.bold ? 'bold' : 'normal', textTransform: el.textCase || 'none', textShadow: textShadow }}>
                        <textPath href={`#preview-curve-${el.id || idx}`} startOffset="50%" textAnchor="middle">
                          {el.text || 'Curve Text'}
                        </textPath>
                      </text>
                    </svg>
                  ) : (
                    el.text || 'Text Field'
                  )}
                </div>
              ) : el.shapeType === 'placeholder' ? (
                <div
                  style={{ backgroundColor: el.fill || '#e2e8f0', color: el.color || '#64748b', fontSize: `${Math.max(6, (el.fontSize || 14) * scale)}px` }}
                  className="w-full h-full rounded-xl flex items-center justify-center text-center font-bold p-2 whitespace-pre-line shadow-inner border border-slate-300/60"
                >
                  {el.text || 'Placeholder'}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {renderShapeIcon(el.shapeType, el.fill || '#000000')}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

function StudioEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminMode = searchParams?.get('adminMode') === 'true' || searchParams?.get('admin') === 'true';
  const adminTemplateId = searchParams?.get('templateId');

  // Active state
  const [activeSide, setActiveSide] = useState('Front'); // 'Front' | 'Back'
  const [activeTab, setActiveTab] = useState('Text'); // 'Product options' | 'Text' | 'Uploads' | 'Graphics' | 'Background' | 'Template' | 'Template color' | 'More'
  const [zoomLevel, setZoomLevel] = useState(100); // 75 | 100 | 125 | 150
  const [showSafetyArea, setShowSafetyArea] = useState(true);
  const [showBleed, setShowBleed] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [hasApprovedDesign, setHasApprovedDesign] = useState(false);
  const [reviewStep, setReviewStep] = useState('review'); // 'review' | 'final'

  // Product configuration state
  const [productOptions, setProductOptions] = useState({
    category: 'Standard Visiting Cards',
    orientation: 'Horizontal (91.8mm x 53.8mm)',
    corners: 'Standard Square Corners',
    stock: 'Standard Matte (300 gsm)',
    finish: 'Smooth Uncoated',
    quantity: '100 cards - ₹200.00'
  });

  // Elements state per side
  const [frontElements, setFrontElements] = useState(DEFAULT_FRONT_ELEMENTS);
  const [backElements, setBackElements] = useState(DEFAULT_BACK_ELEMENTS);
  const [frontBackground, setFrontBackground] = useState('#ffffff');
  const [backBackground, setBackBackground] = useState('#ffffff');

  // Selected element & uploaded images
  const [selectedId, setSelectedId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [graphicsSearch, setGraphicsSearch] = useState('');
  const [graphicsCategory, setGraphicsCategory] = useState(null);
  const [adminGraphicAssets, setAdminGraphicAssets] = useState([]);

  useEffect(() => {
    fetch('/api/graphics')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setAdminGraphicAssets(data.data);
        }
      })
      .catch(err => console.error('Error loading admin graphics:', err));
  }, []);

  const [recentColors, setRecentColors] = useState(['#751fb8', '#000000']);
  const [bgTab, setBgTab] = useState('Swatches');
  const [bgHue, setBgHue] = useState(280);
  const [pickerPos, setPickerPos] = useState({ x: 75, y: 30 });
  const [qrInput, setQrInput] = useState('');
  const [qrError, setQrError] = useState('');
  const [qrStyle, setQrStyle] = useState('classic');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Dragging & Resizing state on canvas
  const [draggingEl, setDraggingEl] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingEl, setResizingEl] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0, aspectRatio: null });
  const canvasRef = useRef(null);

  // Read URL query parameters to pre-fill elements if navigated from templates
  useEffect(() => {
    if (!searchParams) return;
    const templateId = searchParams.get('templateId');
    const templateTitle = searchParams.get('templateTitle');
    const bgImage = searchParams.get('bgImage');
    const backBgImage = searchParams.get('backBgImage');
    const size = searchParams.get('size');
    const orientation = searchParams.get('orientation');
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const unitPrice = searchParams.get('unitPrice');
    const customCompany = searchParams.get('customCompany');
    const customPerson = searchParams.get('customPerson');
    const customTitle = searchParams.get('customTitle');
    const selectedColor = searchParams.get('selectedColor');

    let localSessionBg = null;
    let localSessionBackBg = null;
    if (typeof window !== 'undefined') {
      try {
        const storedAdminSession = localStorage.getItem('a2v_admin_editor_session') || sessionStorage.getItem('a2v_editor_session');
        if (storedAdminSession) {
          const parsedAdmin = JSON.parse(storedAdminSession);
          if (parsedAdmin.templateId === templateId || searchParams?.get('adminMode') === 'true' || !templateId) {
            localSessionBg = parsedAdmin.bgImage || parsedAdmin.frontBackground;
            localSessionBackBg = parsedAdmin.backBgImage || parsedAdmin.backBackground;
          }
        }
      } catch (e) {}
    }

    if (bgImage && bgImage.trim() !== '') {
      setFrontBackground(bgImage);
    } else if (localSessionBg) {
      setFrontBackground(localSessionBg);
    }

    if (backBgImage && backBgImage.trim() !== '') {
      setBackBackground(backBgImage);
    } else if (localSessionBackBg) {
      setBackBackground(localSessionBackBg);
    }

    if (orientation || size || category || price) {
      setProductOptions(prev => ({
        ...prev,
        category: category || prev.category,
        orientation: orientation ? (size ? `${orientation} (${size})` : orientation) : (size ? `Standard (${size})` : prev.orientation),
        quantity: price && unitPrice ? `${unitPrice} - ${price}` : prev.quantity
      }));
    }

    const applyOverrides = (elementsList) => {
      if (!customCompany && !customPerson && !customTitle && !selectedColor) return elementsList;
      return elementsList.map(el => {
        const lowerLabel = (el.label || el.text || '').toLowerCase();
        if ((el.id === 'el-company-name' || lowerLabel.includes('company') || lowerLabel.includes('brand')) && customCompany) {
          return { ...el, text: customCompany };
        }
        if ((el.id === 'el-person-name' || lowerLabel.includes('person') || lowerLabel.includes('name') || lowerLabel.includes('full name')) && customPerson) {
          return { ...el, text: customPerson };
        }
        if ((el.id === 'el-job-title' || lowerLabel.includes('job') || lowerLabel.includes('title') || lowerLabel.includes('designation')) && customTitle) {
          return { ...el, text: customTitle };
        }
        if (selectedColor && (el.color === '#2563EB' || el.fill === '#2563EB')) {
          return { ...el, color: el.color ? selectedColor : undefined, fill: el.fill ? selectedColor : undefined };
        }
        return el;
      });
    };

    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const tpl = data.data;
            const currentUrlBg = searchParams?.get('bgImage');
            const currentUrlBackBg = searchParams?.get('backBgImage');

            if (!currentUrlBg || currentUrlBg.trim() === '') {
              if (localSessionBg) {
                setFrontBackground(localSessionBg);
              } else if (tpl.frontBackground || tpl.frontImage || tpl.image) {
                setFrontBackground(tpl.frontBackground || tpl.frontImage || tpl.image);
              }
            } else {
              setFrontBackground(currentUrlBg);
            }

            if (!currentUrlBackBg || currentUrlBackBg.trim() === '') {
              if (localSessionBackBg) {
                setBackBackground(localSessionBackBg);
              } else if (tpl.backBackground || tpl.backImage || tpl.frontImage || tpl.image) {
                setBackBackground(tpl.backBackground || tpl.backImage || tpl.frontImage || tpl.image);
              }
            } else {
              setBackBackground(currentUrlBackBg);
            }

            if (tpl.frontElements && Array.isArray(tpl.frontElements) && tpl.frontElements.length > 0) {
              setFrontElements(applyOverrides(tpl.frontElements));
            } else if (customCompany || customPerson || customTitle || selectedColor) {
              setFrontElements(prev => applyOverrides(prev));
            }
            if (tpl.backElements && Array.isArray(tpl.backElements) && tpl.backElements.length > 0) {
              setBackElements(tpl.backElements);
            }
          } else if (customCompany || customPerson || customTitle || selectedColor) {
            setFrontElements(prev => applyOverrides(prev));
          }
        })
        .catch(err => {
          console.error('Failed fetching template layout:', err);
          if (customCompany || customPerson || customTitle || selectedColor) {
            setFrontElements(prev => applyOverrides(prev));
          }
        });
    } else if (customCompany || customPerson || customTitle || selectedColor) {
      setFrontElements(prev => applyOverrides(prev));
    }
  }, [searchParams]);

  // Restore session on accidental page refresh (sessionStorage is automatically wiped on tab/window close)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (searchParams && (searchParams.get('bgImage') || searchParams.get('templateId'))) {
        return;
      }
      const savedSession = sessionStorage.getItem('a2v_editor_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.frontElements) setFrontElements(parsed.frontElements);
        if (parsed.backElements) setBackElements(parsed.backElements);
        if (parsed.frontBackground) setFrontBackground(parsed.frontBackground);
        if (parsed.backBackground) setBackBackground(parsed.backBackground);
        if (parsed.productOptions) setProductOptions(parsed.productOptions);
        if (parsed.activeSide) setActiveSide(parsed.activeSide);
        if (parsed.uploadedImages) setUploadedImages(parsed.uploadedImages);
      }
    } catch (err) {
      // Ignore storage errors
    }
  }, []);

  // Save changes across accidental refreshes during this active session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('a2v_editor_session', JSON.stringify({
        frontElements,
        backElements,
        frontBackground,
        backBackground,
        productOptions,
        activeSide,
        uploadedImages
      }));
    } catch (err) {
      // Ignore storage errors
    }
  }, [frontElements, backElements, frontBackground, backBackground, productOptions, activeSide, uploadedImages]);

  const currentElements = activeSide === 'Front' ? frontElements : backElements;
  const setCurrentElements = activeSide === 'Front' ? setFrontElements : setBackElements;
  const currentBackground = activeSide === 'Front' ? frontBackground : backBackground;
  const setCurrentBackground = activeSide === 'Front' ? setFrontBackground : setBackBackground;

  const handleBackgroundChange = (hex) => {
    setCurrentBackground(hex);
    if (hex && typeof hex === 'string' && !hex.startsWith('http') && !hex.startsWith('/') && !hex.startsWith('data:image') && !hex.startsWith('blob:') && !hex.startsWith('url(') && hex !== '#ffffff' && hex !== 'transparent' && !recentColors.includes(hex.toLowerCase())) {
      setRecentColors(prev => [hex.toLowerCase(), ...prev.slice(0, 5)]);
    }
  };

  const handlePickFromDesign = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          handleBackgroundChange(result.sRGBHex);
        }
      } catch (err) {
        // User canceled picking or errored
      }
    } else {
      const fallbackInput = document.getElementById('fallback-bg-color-picker');
      if (fallbackInput) fallbackInput.click();
    }
  };

  const designColors = Array.from(new Set(
    currentElements.flatMap(el => [el.color, el.fill, el.borderColor]).filter(c => c && typeof c === 'string' && c !== 'transparent' && c !== 'none')
  ));

  const selectedElement = currentElements.find(el => el.id === selectedId) || null;

  // Calculate dynamic pricing: 50% add-on if back side has any custom elements or background color
  const priceMatch = productOptions.quantity.match(/₹([0-9,.]+)/);
  const frontPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 200;
  const isBackCustomized = backElements.length > 0 || (backBackground && backBackground !== '#ffffff' && backBackground !== 'transparent');
  const backAddonPrice = isBackCustomized ? frontPrice * 0.5 : 0;
  const totalPrice = frontPrice + backAddonPrice;

  // Save snapshot for undo/redo
  const saveToHistory = () => {
    const snapshot = {
      frontElements: JSON.parse(JSON.stringify(frontElements)),
      backElements: JSON.parse(JSON.stringify(backElements)),
      frontBackground,
      backBackground
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const snap = history[nextIndex];
      setFrontElements(snap.frontElements);
      setBackElements(snap.backElements);
      setFrontBackground(snap.frontBackground);
      setBackBackground(snap.backBackground);
      setHistoryIndex(nextIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const snap = history[nextIndex];
      setFrontElements(snap.frontElements);
      setBackElements(snap.backElements);
      setFrontBackground(snap.frontBackground);
      setBackBackground(snap.backBackground);
      setHistoryIndex(nextIndex);
    }
  };

  // Update a property of the selected element
  const updateSelectedProperty = (key, value) => {
    if (!selectedId) return;
    setCurrentElements(prev =>
      prev.map(el => {
        if (el.id === selectedId) {
          return { ...el, [key]: value };
        }
        return el;
      })
    );
  };

  // Add new text element
  const handleAddText = () => {
    const newId = `el-text-${Date.now()}`;
    const newEl = {
      id: newId,
      type: 'text',
      text: 'Text',
      label: 'Text',
      x: 100,
      y: 150,
      fontSize: 20,
      fontFamily: 'Fira Sans',
      color: '#0f172a',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      width: 240
    };
    setCurrentElements(prev => [...prev, newEl]);
    setSelectedId(newId);
    setEditingTextId(newId);
  };

  // Delete element
  const handleDeleteElement = (id) => {
    setCurrentElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingTextId === id) setEditingTextId(null);
  };

  // Duplicate element
  const handleDuplicateElement = (el) => {
    const dupId = `el-dup-${Date.now()}`;
    const dupEl = { ...el, id: dupId, x: el.x + 15, y: el.y + 15 };
    setCurrentElements(prev => [...prev, dupEl]);
    setSelectedId(dupId);
    if (el.type === 'text') setEditingTextId(dupId);
  };

  // Canvas Mouse Drag Events
  const handleMouseDownOnElement = (e, el) => {
    e.stopPropagation();
    if (editingTextId === el.id) {
      return; // Do not initiate dragging while typing inside the inline textarea
    }
    setSelectedId(el.id);
    setDraggingEl(el.id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const scale = zoomLevel / 100;
      const clickX = (e.clientX - canvasRect.left) / scale;
      const clickY = (e.clientY - canvasRect.top) / scale;
      setDragOffset({ x: clickX - el.x, y: clickY - el.y });
    }
  };

  const handleResizeMouseDown = (e, el) => {
    e.stopPropagation();
    setResizingEl(el.id);
    const aspect = el.aspectRatio || ((el.width || 100) / (el.height || 100));
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: el.width || 100,
      h: el.height || 100,
      aspectRatio: el.type === 'image' ? aspect : null
    });
  };

  const handleMouseMoveOnCanvas = (e) => {
    if (resizingEl && canvasRef.current) {
      const scale = zoomLevel / 100;
      const deltaX = (e.clientX - resizeStart.x) / scale;
      const deltaY = (e.clientY - resizeStart.y) / scale;

      let newW = Math.max(20, resizeStart.w + deltaX);
      let newH = Math.max(20, resizeStart.h + deltaY);

      if (resizeStart.aspectRatio) {
        newH = Math.round(newW / resizeStart.aspectRatio);
      }

      setCurrentElements(prev =>
        prev.map(el => (el.id === resizingEl ? { ...el, width: Math.round(newW), height: Math.round(newH) } : el))
      );
      return;
    }

    if (!draggingEl || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;
    let newX = (e.clientX - canvasRect.left) / scale - dragOffset.x;
    let newY = (e.clientY - canvasRect.top) / scale - dragOffset.y;

    // Constrain inside card boundary (approx 620x350)
    newX = Math.max(-50, Math.min(newX, 600));
    newY = Math.max(-50, Math.min(newY, 330));

    setCurrentElements(prev =>
      prev.map(el => (el.id === draggingEl ? { ...el, x: Math.round(newX), y: Math.round(newY) } : el))
    );
  };

  const handleMouseUpOnCanvas = () => {
    if (draggingEl || resizingEl) {
      setDraggingEl(null);
      setResizingEl(null);
      saveToHistory();
    }
  };

  // Apply quick theme / template
  const handleApplyTemplate = (t) => {
    setCurrentBackground(t.bg);
    if (t.size || t.orientation) {
      setProductOptions(prev => ({
        ...prev,
        orientation: t.orientation ? (t.size ? `${t.orientation} (${t.size})` : t.orientation) : (t.size ? `Standard (${t.size})` : prev.orientation)
      }));
    }
    setCurrentElements(prev =>
      prev.map(el => {
        if (el.color) return { ...el, color: el.color === '#64748b' ? '#64748b' : t.primaryColor };
        if (el.fill && el.shapeType === 'line') return { ...el, fill: t.primaryColor };
        return el;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F2F4F7] text-slate-800 select-none font-sans">

      {/* 1. STUDIO HEADER / TOPBAR (Replicating exact Vistaprint Topbar) */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-40 shadow-xs">

        {/* Left: Brand & Product Selector & Undo/Redo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <span className="w-8 h-8 rounded-lg bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white font-black flex items-center justify-center text-sm shadow-sm">
              V
            </span>
            <span className="font-extrabold text-slate-900 tracking-tight hidden sm:inline text-sm">
              A2V Studio
            </span>
          </Link>

          {/* Product Category Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#0070e0] py-1.5 px-2.5 rounded-lg border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100 transition-colors">
              <span>{productOptions.category}</span>
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Undo / Redo / History / Reset Controls */}
          <div className="flex items-center gap-1 text-slate-600 pl-2 border-l border-slate-200/80">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (confirm('Clear custom design elements and reset canvas?')) {
                  setFrontElements(DEFAULT_FRONT_ELEMENTS);
                  setBackElements(DEFAULT_BACK_ELEMENTS);
                  setFrontBackground('#ffffff');
                  setBackBackground('#ffffff');
                  try { sessionStorage.removeItem('a2v_editor_session'); } catch (e) { }
                }
              }}
              title="Reset Canvas"
              className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-500 hover:text-rose-600 ml-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Preview, Price & Next Button */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${isPreviewMode
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <span>👁</span>
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          {!isAdminMode && (
            <div className="text-right hidden md:block">
              <div className="text-sm font-black text-slate-900 leading-none flex items-center justify-end gap-1.5">
                <span>₹{totalPrice.toFixed(2)}</span>
                {isBackCustomized && (
                  <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider" title="Back side custom design (+50%)">
                    +50% Back
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                {productOptions.quantity.split(' -')[0]} • {isBackCustomized ? 'Double Sided' : 'Single Sided'}
              </span>
            </div>
          )}

          {isAdminMode ? (
            <button
              onClick={async () => {
                if (!adminTemplateId) {
                  alert('No template ID found to save to. Please ensure templateId is in the URL.');
                  return;
                }
                try {
                  const res = await fetch(`/api/templates/${adminTemplateId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      frontElements,
                      backElements,
                      frontBackground,
                      backBackground
                    })
                  });
                  if (res.ok) {
                    alert('🎉 Admin Layout Saved Successfully! When users customize this template, they will start with your exact text positions, images, and layout.');
                  } else {
                    const err = await res.json();
                    alert(`Failed to save admin layout: ${err.error || 'Unknown error'}`);
                  }
                } catch (err) {
                  console.error('Error saving admin layout:', err);
                  alert('Error saving admin layout. Check console.');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ring-2 ring-emerald-400/50"
            >
              <span>💾 Save Admin Template Layout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setHasApprovedDesign(false);
                setReviewStep('review');
                setShowNextModal(true);
              }}
              className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-extrabold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          )}
        </div>
      </header>

      {isAdminMode && (
        <div className="bg-indigo-900 text-white px-4 py-2 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm z-30 gap-1 border-b border-indigo-700">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0">ADMIN DESIGN MODE</span>
            <span>You are setting the default layout, text positions, and images for template: <strong className="underline">{searchParams?.get('templateTitle') || adminTemplateId}</strong></span>
          </div>
          <span className="text-indigo-200 text-[11px] font-normal">Click &quot;💾 Save Admin Template Layout&quot; above when done to save as defaults for users.</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (Sidebar Drawer + Center Canvas + Right Switcher) */}
      <div className="flex flex-1 overflow-hidden relative">

        {!isPreviewMode && (
          <>
            {/* LEFTMOST VERTICAL TAB ICON STRIP (Exactly like Vistaprint leftmost strip) */}
            <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-1 shrink-0 z-30 shadow-2xs overflow-y-auto no-scrollbar">
              {[
                { id: 'Product options', icon: '⚙', label: 'Product options' },
                { id: 'Text', icon: 'T', label: 'Text' },
                { id: 'Uploads', icon: '⬆', label: 'Uploads' },
                { id: 'Graphics', icon: '⬠', label: 'Graphics' },
                { id: 'Background', icon: '🎨', label: 'Background' },
                { id: 'QR-codes', icon: '▦', label: 'QR-codes' },
                { id: 'Template', icon: '❐', label: 'Template' },
                { id: 'Template color', icon: '🖌', label: 'Template color' },
                { id: 'More', icon: '+', label: 'More' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'Graphics') setGraphicsCategory(null);
                    }}
                    className={`w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group relative cursor-pointer ${isActive
                        ? 'bg-sky-50 text-[#0070e0] font-black shadow-2xs border border-sky-200/60'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                      }`}
                  >
                    <span className="text-lg leading-none">{tab.icon}</span>
                    <span className="text-[10px] leading-tight text-center px-1 line-clamp-1">{tab.label}</span>
                    {isActive && (
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0070e0] rounded-l-full" />
                    )}
                  </button>
                );
              })}
            </aside>

            {/* EXPANDABLE LEFT DRAWER / OPTIONS PANEL (Approx 280px wide) */}
            <div className="w-90 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xs">

              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  {activeTab === 'Background' ? 'Background color' : activeTab === 'QR-codes' ? 'QR Code Generator' : activeTab}
                </h2>
                {activeTab === 'Effects' ? (
                  <button
                    onClick={() => setActiveTab('Text')}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm"
                    title="Close Effects"
                  >
                    ×
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-bold">↗↙</span>
                )}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">

                {/* --- TAB 1: TEXT (Exact screenshot reproduction!) --- */}
                {activeTab === 'Text' && (
                  <div className="space-y-4">
                    <button
                      onClick={handleAddText}
                      className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Add text</span>
                    </button>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                        <span>Editable Text Layers ({currentElements.filter(e => e.type === 'text').length})</span>
                      </div>

                      {currentElements
                        .filter(el => el.type === 'text')
                        .map((el) => {
                          const isSelected = selectedId === el.id;
                          return (
                            <div
                              key={el.id}
                              onClick={() => setSelectedId(el.id)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                                  ? 'bg-sky-50/70 border-sky-400 shadow-2xs'
                                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[150px]">
                                  {el.label || 'Text Field'}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateElement(el);
                                    }}
                                    title="Duplicate layer"
                                    className="p-1 text-slate-400 hover:text-blue-600 rounded"
                                  >
                                    ❐
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteElement(el.id);
                                    }}
                                    title="Delete layer"
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                  >
                                    🗑
                                  </button>
                                </div>
                              </div>

                              <input
                                type="text"
                                value={el.text}
                                style={{ textTransform: el.textCase || 'none' }}
                                onChange={(e) => {
                                  setCurrentElements(prev =>
                                    prev.map(item => (item.id === el.id ? { ...item, text: e.target.value } : item))
                                  );
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(el.id);
                                }}
                                onFocus={() => setSelectedId(el.id)}
                                placeholder="Type text here..."
                                className="w-full bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* --- TAB: EFFECTS (Exact Vistaprint Screenshot reproduction!) --- */}
                {activeTab === 'Effects' && (
                  <div className="space-y-6 pb-6">
                    {/* Style Section */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 mb-2.5">Style</h3>

                      {/* Grid 1: Original, Shadow, Highlight */}
                      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                        {/* Original */}
                        <button
                          onClick={() => updateSelectedProperty('effect', 'original')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${!selectedElement?.effect || selectedElement.effect === 'original' || selectedElement.effect === 'none'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl font-black text-slate-800">A</span>
                          <span className="text-[10px] font-bold text-slate-700">Original</span>
                        </button>

                        {/* Shadow */}
                        <button
                          onClick={() => updateSelectedProperty('effect', 'shadow')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${selectedElement?.effect === 'shadow'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl font-black text-blue-500 drop-shadow-[2px_2px_3px_rgba(0,112,224,0.5)]">A</span>
                          <span className="text-[10px] font-bold text-slate-700">Shadow</span>
                          {selectedElement?.effect === 'shadow' && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>

                        {/* Highlight */}
                        <button
                          onClick={() => updateSelectedProperty('effect', 'highlight')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${selectedElement?.effect === 'highlight'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl font-black text-blue-900 bg-sky-200/90 px-1.5 rounded">A</span>
                          <span className="text-[10px] font-bold text-slate-700">Highlight</span>
                          {selectedElement?.effect === 'highlight' && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>
                      </div>

                      {/* Grid 2: Glitch, Echo */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Glitch */}
                        <button
                          onClick={() => updateSelectedProperty('effect', 'glitch')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${selectedElement?.effect === 'glitch'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl font-black text-slate-900 tracking-wider [text-shadow:-2px_0_0_#06b6d4,2px_0_0_#ec4899]">A</span>
                          <span className="text-[10px] font-bold text-slate-700">Glitch</span>
                          {selectedElement?.effect === 'glitch' && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>

                        {/* Echo */}
                        <button
                          onClick={() => updateSelectedProperty('effect', 'echo')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${selectedElement?.effect === 'echo'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl font-black text-slate-800 [text-shadow:2px_2px_0px_#94a3b8,4px_4px_0px_#cbd5e1]">A</span>
                          <span className="text-[10px] font-bold text-slate-700">Echo</span>
                          {selectedElement?.effect === 'echo' && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Conditional Settings: SHADOW SLIDERS */}
                    {selectedElement?.effect === 'shadow' && (
                      <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Shadow color</span>
                          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 shadow-2xs cursor-pointer">
                            <input
                              type="color"
                              value={selectedElement.shadowColor || '#000000'}
                              onChange={(e) => updateSelectedProperty('shadowColor', e.target.value)}
                              className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Distance Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Distance</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateSelectedProperty('shadowDistance', 10)} title="Reset" className="text-slate-400 hover:text-slate-700 font-bold text-xs">↺</button>
                              <span className="w-10 px-1 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-bold text-slate-800">{selectedElement.shadowDistance !== undefined ? selectedElement.shadowDistance : 10}</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedElement.shadowDistance !== undefined ? selectedElement.shadowDistance : 10}
                            onChange={(e) => updateSelectedProperty('shadowDistance', Number(e.target.value))}
                            className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Opacity Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Opacity</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateSelectedProperty('shadowOpacity', 40)} title="Reset" className="text-slate-400 hover:text-slate-700 font-bold text-xs">↺</button>
                              <span className="w-10 px-1 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-bold text-slate-800">{selectedElement.shadowOpacity !== undefined ? selectedElement.shadowOpacity : 40}</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedElement.shadowOpacity !== undefined ? selectedElement.shadowOpacity : 40}
                            onChange={(e) => updateSelectedProperty('shadowOpacity', Number(e.target.value))}
                            className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Angle Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Angle</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateSelectedProperty('shadowAngle', 35)} title="Reset" className="text-slate-400 hover:text-slate-700 font-bold text-xs">↺</button>
                              <span className="w-10 px-1 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-bold text-slate-800">{selectedElement.shadowAngle !== undefined ? selectedElement.shadowAngle : 35}</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={selectedElement.shadowAngle !== undefined ? selectedElement.shadowAngle : 35}
                            onChange={(e) => updateSelectedProperty('shadowAngle', Number(e.target.value))}
                            className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Blur Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Blur</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateSelectedProperty('shadowBlur', 10)} title="Reset" className="text-slate-400 hover:text-slate-700 font-bold text-xs">↺</button>
                              <span className="w-10 px-1 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-bold text-slate-800">{selectedElement.shadowBlur !== undefined ? selectedElement.shadowBlur : 10}</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={selectedElement.shadowBlur !== undefined ? selectedElement.shadowBlur : 10}
                            onChange={(e) => updateSelectedProperty('shadowBlur', Number(e.target.value))}
                            className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional Settings: HIGHLIGHT */}
                    {selectedElement?.effect === 'highlight' && (
                      <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Highlight color</span>
                          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 shadow-2xs cursor-pointer">
                            <input
                              type="color"
                              value={selectedElement.highlightColor || '#dbeafe'}
                              onChange={(e) => updateSelectedProperty('highlightColor', e.target.value)}
                              className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Conditional Settings: GLITCH / ECHO */}
                    {(selectedElement?.effect === 'glitch' || selectedElement?.effect === 'echo') && (
                      <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Effect Intensity</span>
                          <span className="text-xs font-bold text-slate-800">{selectedElement.effectIntensity || 5}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="15"
                          value={selectedElement.effectIntensity !== undefined ? selectedElement.effectIntensity : 5}
                          onChange={(e) => updateSelectedProperty('effectIntensity', Number(e.target.value))}
                          className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Shape Section */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 mb-2.5">Shape</h3>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* None */}
                        <button
                          onClick={() => updateSelectedProperty('textShape', 'none')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${!selectedElement?.textShape || selectedElement.textShape === 'none'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-xl font-black text-slate-800 border-b-2 border-slate-700 pb-0.5">A</span>
                          <span className="text-[10px] font-bold text-slate-700">None</span>
                          {(!selectedElement?.textShape || selectedElement.textShape === 'none') && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>

                        {/* Curve */}
                        <button
                          onClick={() => updateSelectedProperty('textShape', 'curve')}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 relative bg-white ${selectedElement?.textShape === 'curve'
                              ? 'border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-xs font-black text-slate-800 tracking-wider transform -rotate-6">ABCD</span>
                          <span className="text-[10px] font-bold text-slate-700">Curve</span>
                          {selectedElement?.textShape === 'curve' && (
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0070e0] text-white flex items-center justify-center text-[9px] font-black">✓</span>
                          )}
                        </button>
                      </div>

                      {/* Curve Intensity Slider */}
                      {selectedElement?.textShape === 'curve' && (
                        <div className="mt-4 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Curve Radius</span>
                            <span className="w-10 px-1 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-bold text-slate-800">{selectedElement.curveRadius !== undefined ? selectedElement.curveRadius : 30}°</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="75"
                            value={selectedElement.curveRadius !== undefined ? selectedElement.curveRadius : 30}
                            onChange={(e) => updateSelectedProperty('curveRadius', Number(e.target.value))}
                            className="w-full accent-[#0070e0] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- TAB 2: PRODUCT OPTIONS --- */}
                {activeTab === 'Product options' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Orientation</label>
                      <select
                        value={productOptions.orientation.toLowerCase().includes('vertical') ? 'Vertical' : 'Horizontal'}
                        onChange={(e) => setProductOptions({ ...productOptions, orientation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Horizontal">Horizontal</option>
                        <option value="Vertical">Vertical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Corner Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Standard Square Corners', 'Rounded Corners'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setProductOptions({ ...productOptions, corners: c })}
                            className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${productOptions.corners === c
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                          >
                            {c.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Paper Stock</label>
                      <select
                        value={productOptions.stock}
                        onChange={(e) => setProductOptions({ ...productOptions, stock: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option>Standard Matte (300 gsm)</option>
                        <option>Premium Gloss Coated (350 gsm)</option>
                        <option>Spot UV Textured (350 gsm)</option>
                        <option>Ultra Thick Painted Edge (600 gsm)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity & Pricing</label>
                      <select
                        value={productOptions.quantity}
                        onChange={(e) => setProductOptions({ ...productOptions, quantity: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option>100 cards - ₹200.00</option>
                        <option>250 cards - ₹450.00 (Save 10%)</option>
                        <option>500 cards - ₹800.00 (Save 20%)</option>
                        <option>1,000 cards - ₹1,400.00 (Save 30%)</option>
                      </select>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                      💡 Changing orientation automatically adjusts canvas safety margin boundaries!
                    </div>
                  </div>
                )}

                {/* --- TAB 3: UPLOADS --- */}
                {activeTab === 'Uploads' && (
                  <div className="space-y-4">
                    <label className="border-2 border-dashed border-blue-400/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-blue-50/40 hover:bg-blue-50 cursor-pointer transition-colors">
                      <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold mb-2">⬆</span>
                      <span className="text-xs font-extrabold text-blue-900">Upload your image / logo</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG up to 25MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const imgUrl = event.target.result;
                              const img = new Image();
                              img.onload = () => {
                                const natW = img.naturalWidth || 200;
                                const natH = img.naturalHeight || 200;
                                const maxDim = 180;
                                let w = natW;
                                let h = natH;
                                if (w > maxDim || h > maxDim) {
                                  if (w > h) {
                                    h = Math.round((h / w) * maxDim);
                                    w = maxDim;
                                  } else {
                                    w = Math.round((w / h) * maxDim);
                                    h = maxDim;
                                  }
                                }
                                const newId = `el-img-${Date.now()}`;
                                const newImgObj = {
                                  id: Date.now(),
                                  url: imgUrl,
                                  name: file.name,
                                  naturalWidth: natW,
                                  naturalHeight: natH,
                                  aspectRatio: natW / natH,
                                  width: w,
                                  height: h
                                };
                                setUploadedImages(prev => [newImgObj, ...prev]);
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: 'image',
                                    url: imgUrl,
                                    label: file.name.substring(0, 18),
                                    x: 180,
                                    y: 80,
                                    width: w,
                                    height: h,
                                    aspectRatio: natW / natH
                                  }
                                ]);
                                setSelectedId(newId);
                              };
                              img.src = imgUrl;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {uploadedImages.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-extrabold text-slate-700 mb-2 flex items-center justify-between">
                          <span>Your Uploaded Images ({uploadedImages.length})</span>
                          <span className="text-[10px] font-normal text-slate-400">Click to add</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {uploadedImages.map((imgItem) => (
                            <div
                              key={imgItem.id}
                              onClick={() => {
                                const newId = `el-img-${Date.now()}`;
                                const w = imgItem.width || 150;
                                const h = imgItem.height || 150;
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: 'image',
                                    url: imgItem.url,
                                    label: imgItem.name.substring(0, 18),
                                    x: 180,
                                    y: 80,
                                    width: w,
                                    height: h,
                                    aspectRatio: imgItem.aspectRatio || (w / h)
                                  }
                                ]);
                                setSelectedId(newId);
                              }}
                              className="group relative p-2 rounded-xl border border-slate-200 bg-white hover:border-blue-400 shadow-2xs cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-all"
                            >
                              <div className="w-full h-20 bg-slate-50 rounded-lg flex items-center justify-center p-1 mb-1.5 overflow-hidden border border-slate-100">
                                <img
                                  src={imgItem.url}
                                  alt={imgItem.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                                {imgItem.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadedImages(prev => prev.filter(item => item.id !== imgItem.id));
                                }}
                                title="Remove image"
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center shadow transition-opacity hover:bg-rose-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB 4: GRAPHICS (Exact Vistaprint Screenshot reproduction!) --- */}
                {activeTab === 'Graphics' && (
                  <div className="space-y-6 pb-6">
                    {graphicsCategory === 'Shapes' ? (
                      <div>
                        {/* Header: < Shapes */}
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => setGraphicsCategory(null)}
                            className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm hover:text-blue-600 cursor-pointer"
                          >
                            <span className="text-base font-black">‹</span>
                            <span>Shapes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGraphicsCategory(null)}
                            className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                            title="Collapse"
                          >
                            ↗↙
                          </button>
                        </div>

                        {/* Exact 10 Shapes Grid */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {GRAPHICS_SHAPES.map((shape) => (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() => {
                                const newId = `el-shape-${Date.now()}`;
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: 'shape',
                                    shapeType: shape.id,
                                    x: 140,
                                    y: 80,
                                    width: 90,
                                    height: 90,
                                    fill: '#000000'
                                  }
                                ]);
                                setSelectedId(newId);
                              }}
                              className="aspect-square bg-slate-50/60 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer group"
                              title={shape.name}
                            >
                              <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                                {renderShapeIcon(shape.id, '#000000')}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Search bar */}
                        <div className="relative">
                          <input
                            type="text" 
                            value={graphicsSearch}
                            onChange={(e) => setGraphicsSearch(e.target.value)}
                            placeholder="Search for content"
                            className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-3.5 pr-9 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">🔍</span>
                        </div>

                        {/* Shapes Section */}
                        {(!graphicsSearch || 'shapes square circle triangle pentagon line arrow star bubble'.includes(graphicsSearch.toLowerCase())) && (
                          <div>
                            <div
                              onClick={() => setGraphicsCategory('Shapes')}
                              className="flex items-center justify-between mb-2.5 cursor-pointer group"
                            >
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Shapes</h4>
                              <span className="text-sm font-black text-slate-700 group-hover:translate-x-0.5 transition-transform">›</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2.5">
                              {GRAPHICS_SHAPES.slice(0, 3).map((shape) => (
                                <button
                                  key={shape.id}
                                  type="button"
                                  onClick={() => {
                                    const newId = `el-shape-${Date.now()}`;
                                    setCurrentElements(prev => [
                                      ...prev,
                                      {
                                        id: newId,
                                        type: 'shape',
                                        shapeType: shape.id,
                                        x: 140,
                                        y: 80,
                                        width: 90,
                                        height: 90,
                                        fill: '#000000'
                                      }
                                    ]);
                                    setSelectedId(newId);
                                  }}
                                  className="aspect-square bg-white border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer group"
                                  title={shape.name}
                                >
                                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                                    {renderShapeIcon(shape.id, '#000000')}
                                  </div>
                                </button>
                              ))}
                            </div>
                            {/* Pagination indicator */}
                            <div className="flex justify-center items-center gap-1.5 mt-2.5">
                              <span className="w-3.5 h-1.5 bg-[#0070e0] rounded-full" />
                              <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                              <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                              <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                            </div>
                          </div>
                        )}


                    {/* Images Section */}
                    {(!graphicsSearch || 'images photo flowers business craft workshop'.includes(graphicsSearch.toLowerCase())) && (
                      <div>
                        <div className="flex items-center justify-between mb-2.5 cursor-pointer group">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Images</h4>
                          <span className="text-sm font-black text-slate-700 group-hover:translate-x-0.5 transition-transform">›</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80', label: 'Flowers Florist' },
                            { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80', label: 'Business Meeting' },
                            { url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80', label: 'Crafting Beads' },
                            ...adminGraphicAssets.filter(g => g.category === 'image').map(g => ({ url: g.url, label: g.title, svgContent: g.svgContent }))
                          ].map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const newId = `el-img-${Date.now()}`;
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: img.svgContent ? 'svg' : 'image',
                                    url: img.url,
                                    svgContent: img.svgContent,
                                    label: img.label,
                                    x: 100 + (idx % 4) * 20,
                                    y: 60 + (idx % 4) * 20,
                                    width: 130,
                                    height: 130,
                                    naturalWidth: 300,
                                    naturalHeight: 300
                                  }
                                ]);
                                setSelectedId(newId);
                              }}
                              className="aspect-square bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden shadow-2xs transition-all cursor-pointer group relative"
                              title={img.label}
                            >
                              <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-center items-center gap-1.5 mt-2.5">
                          <span className="w-3.5 h-1.5 bg-[#0070e0] rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                        </div>
                      </div>
                    )}

                    {/* Icons Section */}
                    {(!graphicsSearch || 'icons globe picture mountains landscape badge outline circle'.includes(graphicsSearch.toLowerCase())) && (
                      <div>
                        <div className="flex items-center justify-between mb-2.5 cursor-pointer group">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Icons</h4>
                          <span className="text-sm font-black text-slate-700 group-hover:translate-x-0.5 transition-transform">›</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* Globe */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'icon-globe', x: 140, y: 80, width: 80, height: 80, fill: '#000000' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="44" fill="none" stroke="black" strokeWidth="8" />
                              <ellipse cx="50" cy="50" rx="20" ry="44" fill="none" stroke="black" strokeWidth="8" />
                              <path d="M 6 50 L 94 50 M 15 25 L 85 25 M 15 75 L 85 75" fill="none" stroke="black" strokeWidth="6" />
                            </svg>
                          </button>

                          {/* Picture Outline Badge */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'icon-badge', x: 150, y: 80, width: 80, height: 80, fill: '#000000' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="44" fill="none" stroke="black" strokeWidth="8" />
                              <polygon points="25,70 50,45 75,70" fill="black" />
                              <circle cx="35" cy="35" r="8" fill="black" />
                            </svg>
                          </button>

                          {/* Picture Solid Circle */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'icon-circle', x: 160, y: 80, width: 80, height: 80, fill: '#000000' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="48" fill="black" />
                              <polygon points="28,70 50,48 72,70" fill="white" />
                              <circle cx="36" cy="36" r="7" fill="white" />
                            </svg>
                          </button>

                          {adminGraphicAssets.filter(g => g.category === 'icon').map((icon, idx) => (
                            <button
                              key={icon.id || idx}
                              onClick={() => {
                                const newId = `el-icon-${Date.now()}`;
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: icon.svgContent ? 'svg' : 'image',
                                    url: icon.url,
                                    svgContent: icon.svgContent,
                                    label: icon.title,
                                    x: 140 + (idx % 4) * 15,
                                    y: 80 + (idx % 4) * 15,
                                    width: 80,
                                    height: 80
                                  }
                                ]);
                                setSelectedId(newId);
                              }}
                              className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-2 shadow-2xs transition-all cursor-pointer overflow-hidden group"
                              title={icon.title}
                            >
                              {icon.svgContent ? (
                                <div dangerouslySetInnerHTML={{ __html: icon.svgContent }} className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform [&>svg]:max-w-full [&>svg]:max-h-full" />
                              ) : (
                                <img src={icon.url} alt={icon.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-center items-center gap-1.5 mt-2.5">
                          <span className="w-3.5 h-1.5 bg-[#0070e0] rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                        </div>
                      </div>
                    )}

                    {/* Illustrations Section */}
                    {(!graphicsSearch || 'illustrations stars starburst badge diamond spark outline'.includes(graphicsSearch.toLowerCase())) && (
                      <div>
                        <div className="flex items-center justify-between mb-2.5 cursor-pointer group">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Illustrations</h4>
                          <span className="text-sm font-black text-slate-700 group-hover:translate-x-0.5 transition-transform">›</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* Twin Stars */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'illust-stars', x: 140, y: 80, width: 100, height: 70, fill: '#cbd5e1' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 140 100" className="w-full h-full">
                              <polygon points="35,10 43,30 65,30 47,43 54,65 35,51 16,65 23,43 5,30 27,30" fill="none" stroke="#cbd5e1" strokeWidth="5" strokeLinejoin="round" />
                              <polygon points="95,25 101,41 118,41 104,51 109,68 95,58 81,68 86,51 72,41 89,41" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* 12-point Starburst Badge */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'illust-starburst', x: 150, y: 80, width: 85, height: 85, fill: '#556b2f' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <polygon points="50,2 62,22 84,14 80,38 100,50 80,62 84,86 62,78 50,98 38,78 16,86 20,62 0,50 20,38 16,14 38,22" fill="#556b2f" />
                            </svg>
                          </button>

                          {/* Diamond Spark */}
                          <button
                            onClick={() => {
                              const newId = `el-shape-${Date.now()}`;
                              setCurrentElements(prev => [...prev, { id: newId, type: 'shape', shapeType: 'illust-spark', x: 160, y: 80, width: 85, height: 85, fill: '#475569' }]);
                              setSelectedId(newId);
                            }}
                            className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-2xs transition-all cursor-pointer"
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <path d="M 50,5 Q 50,50 95,50 Q 50,50 50,95 Q 50,50 5,50 Q 50,50 50,5" fill="none" stroke="#475569" strokeWidth="5" />
                            </svg>
                          </button>

                          {adminGraphicAssets.filter(g => g.category === 'illustration').map((illust, idx) => (
                            <button
                              key={illust.id || idx}
                              onClick={() => {
                                const newId = `el-illust-${Date.now()}`;
                                setCurrentElements(prev => [
                                  ...prev,
                                  {
                                    id: newId,
                                    type: illust.svgContent ? 'svg' : 'image',
                                    url: illust.url,
                                    svgContent: illust.svgContent,
                                    label: illust.title,
                                    x: 140 + (idx % 4) * 15,
                                    y: 80 + (idx % 4) * 15,
                                    width: 100,
                                    height: 100
                                  }
                                ]);
                                setSelectedId(newId);
                              }}
                              className="aspect-square bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center p-2 shadow-2xs transition-all cursor-pointer overflow-hidden group"
                              title={illust.title}
                            >
                              {illust.svgContent ? (
                                <div dangerouslySetInnerHTML={{ __html: illust.svgContent }} className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform [&>svg]:max-w-full [&>svg]:max-h-full" />
                              ) : (
                                <img src={illust.url} alt={illust.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-center items-center gap-1.5 mt-2.5">
                          <span className="w-3.5 h-1.5 bg-[#0070e0] rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                          <span className="w-1.5 h-1.5 border border-slate-400 rounded-full" />
                        </div>
                      </div>
                    )}
                    </>
                    )}
                  </div>
                )}

                {/* --- TAB 5: BACKGROUND (Exact Vistaprint Screenshot reproduction!) --- */}
                {activeTab === 'Background' && (
                  <div className="space-y-5 pb-6">
                    {/* 2D Gradient Color Area Picker Canvas Box */}
                    <div
                      onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                        setPickerPos({ x, y });
                        const lightness = Math.max(0, Math.min(100, Math.round(100 - (y * 0.5) - ((100 - (y * 0.5) - 50) * (x / 100)))));
                        const saturation = Math.round(x);
                        handleBackgroundChange(`hsl(${bgHue}, ${saturation}%, ${lightness}%)`);
                      }}
                      onMouseMove={(e) => {
                        if (e.buttons === 1) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                          const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                          setPickerPos({ x, y });
                          const lightness = Math.max(0, Math.min(100, Math.round(100 - (y * 0.5) - ((100 - (y * 0.5) - 50) * (x / 100)))));
                          const saturation = Math.round(x);
                          handleBackgroundChange(`hsl(${bgHue}, ${saturation}%, ${lightness}%)`);
                        }
                      }}
                      style={{
                        backgroundImage: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${bgHue}, 100%, 50%))`
                      }}
                      className="w-full h-36 rounded-2xl relative overflow-hidden shadow-sm border border-slate-200/80 cursor-crosshair select-none"
                    >
                      {/* Green circle indicator showing exact selected coordinate on canvas */}
                      <span
                        style={{ left: `${pickerPos.x}%`, top: `${pickerPos.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-emerald-500 shadow-sm pointer-events-none transition-all duration-75"
                      />
                    </div>

                    {/* Rainbow Hue Spectrum Bar */}
                    <div className="relative w-full h-2 rounded-full my-2" style={{ backgroundImage: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={bgHue}
                        onChange={(e) => {
                          const h = Number(e.target.value);
                          setBgHue(h);
                          handleBackgroundChange(`hsl(${h}, 85%, 45%)`);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <span
                        style={{ left: `${(bgHue / 360) * 100}%` }}
                        className="absolute -top-1 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-2 border-white shadow pointer-events-none"
                      />
                    </div>

                    {/* Hex Input, Eyedropper, & Clear Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={currentBackground.startsWith('hsl') ? '#751FB8' : currentBackground.toUpperCase()}
                        onChange={(e) => handleBackgroundChange(e.target.value)}
                        placeholder="#751FB8"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-blue-500 shadow-2xs"
                      />

                      {/* Eyedropper Button - Color picker from the design */}
                      <button
                        type="button"
                        onClick={handlePickFromDesign}
                        className="p-2 bg-white border border-slate-300 hover:bg-slate-50 hover:border-blue-500 rounded-xl text-slate-700 shadow-2xs cursor-pointer flex items-center justify-center w-9 h-9 transition-colors group relative"
                        title="Pick color from design"
                      >
                        <span className="text-base leading-none group-hover:scale-110 transition-transform">🖍️</span>
                        <input
                          id="fallback-bg-color-picker"
                          type="color"
                          value={currentBackground.startsWith('#') && currentBackground.length === 7 ? currentBackground : '#751fb8'}
                          onChange={(e) => handleBackgroundChange(e.target.value)}
                          className="sr-only"
                        />
                      </button>

                      {/* Clear / No-color Button */}
                      <button
                        onClick={() => handleBackgroundChange('#ffffff')}
                        className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-rose-500 shadow-2xs font-bold flex items-center justify-center w-9 h-9 text-base leading-none"
                        title="Clear background"
                      >
                        ⃠
                      </button>
                    </div>

                    {/* Swatches vs CMYK vs Images Tabs */}
                    <div className="flex border-b border-slate-200 pt-1">
                      <button
                        onClick={() => setBgTab('Swatches')}
                        className={`pb-2 px-1 text-xs mr-4 cursor-pointer transition-all ${bgTab === 'Swatches'
                            ? 'font-extrabold text-slate-900 border-b-2 border-blue-600 -mb-px'
                            : 'font-bold text-slate-400 hover:text-slate-700'
                          }`}
                      >
                        Swatches
                      </button>
                      <button
                        onClick={() => setBgTab('Images')}
                        className={`pb-2 px-1 text-xs mr-4 cursor-pointer transition-all ${bgTab === 'Images'
                            ? 'font-extrabold text-slate-900 border-b-2 border-blue-600 -mb-px'
                            : 'font-bold text-slate-400 hover:text-slate-700'
                          }`}
                      >
                        Images & Textures
                      </button>
                      <button
                        onClick={() => setBgTab('CMYK')}
                        className={`pb-2 px-1 text-xs cursor-pointer transition-all ${bgTab === 'CMYK'
                            ? 'font-extrabold text-slate-900 border-b-2 border-blue-600 -mb-px'
                            : 'font-bold text-slate-400 hover:text-slate-700'
                          }`}
                      >
                        CMYK
                      </button>
                    </div>

                    {/* Tab Content */}
                    {bgTab === 'Swatches' ? (
                      <div className="space-y-5">
                        {/* Colors from design */}
                        {designColors.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center justify-between">
                              <span>Colors from design</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{designColors.length}</span>
                            </h4>
                            <div className="flex items-center flex-wrap gap-2.5">
                              {designColors.map((color, idx) => {
                                const isSelected = currentBackground.toLowerCase() === color.toLowerCase();
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleBackgroundChange(color)}
                                    style={{ backgroundColor: color }}
                                    className={`w-7 h-7 rounded-full transition-all cursor-pointer ${isSelected
                                        ? 'border-2 border-blue-600 ring-2 ring-blue-600/30 ring-offset-2'
                                        : 'border border-slate-300 hover:scale-105 shadow-2xs'
                                      }`}
                                    title={`Design color: ${color}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recent colors */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 mb-2.5">Recent colors</h4>
                          <div className="flex items-center gap-2.5">
                            {recentColors.map((color, idx) => {
                              const isSelected = currentBackground.toLowerCase() === color.toLowerCase();
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleBackgroundChange(color)}
                                  style={{ backgroundColor: color }}
                                  className={`w-7 h-7 rounded-full transition-all cursor-pointer ${isSelected
                                      ? 'border-2 border-blue-600 ring-2 ring-blue-600/30 ring-offset-2'
                                      : 'border border-slate-300 hover:scale-105'
                                    }`}
                                  title={color}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Pre-set colors (Exact 6x4 Vistaprint Grid!) */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 mb-2.5">Pre-set colors</h4>
                          <div className="grid grid-cols-6 gap-2.5">
                            {[
                              // Row 1 (tints/pastels)
                              '#ffffff', '#bae6fd', '#bbf7d0', '#fef08a', '#fed7aa', '#fecdd3',
                              // Row 2 (medium pastels)
                              '#94a3b8', '#38bdf8', '#4ade80', '#facc15', '#fb923c', '#f87171',
                              // Row 3 (vivid primary)
                              '#475569', '#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444',
                              // Row 4 (rich dark shades)
                              '#000000', '#0284c7', '#15803d', '#a16207', '#b45309', '#991b1b'
                            ].map((hex, idx) => {
                              const isSelected = currentBackground.toLowerCase() === hex.toLowerCase();
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleBackgroundChange(hex)}
                                  style={{ backgroundColor: hex }}
                                  className={`w-7 h-7 rounded-full border border-slate-300/80 transition-transform cursor-pointer hover:scale-110 shadow-2xs ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 border-blue-600' : ''
                                    }`}
                                  title={hex}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : bgTab === 'Images' ? (
                      /* Images & Textures Tab Content */
                      <div className="space-y-5">
                        {/* Upload Custom Background Image */}
                        <div>
                          <label className="border-2 border-dashed border-blue-400/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-blue-50/40 hover:bg-blue-50 cursor-pointer transition-colors">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-base font-bold mb-1.5">⬆</span>
                            <span className="text-xs font-extrabold text-blue-900">Upload background image</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG up to 25MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  handleBackgroundChange(url);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Pre-set Luxury Background Images & Textures Grid */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center justify-between">
                            <span>Pre-set Background Textures</span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">8</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-2.5">
                            {[
                              { name: 'White Luxury Marble', url: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Dark Carbon Texture', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Gold Foil Grain', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Soft Navy Watercolor', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Modern Gradient Mesh', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Wood Grain Texture', url: 'https://images.unsplash.com/photo-1546484396-db3fcad888ee?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Slate Concrete', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
                              { name: 'Warm Sunset Aura', url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=600&auto=format&fit=crop&q=80' }
                            ].map((item, idx) => {
                              const isSelected = currentBackground === item.url;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleBackgroundChange(item.url)}
                                  className={`h-20 rounded-xl relative overflow-hidden border transition-all text-left group cursor-pointer ${isSelected
                                      ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md scale-102'
                                      : 'border-slate-200 hover:border-slate-400 shadow-2xs hover:scale-101'
                                    }`}
                                >
                                  <img src={item.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                                    <span className="text-[10px] font-extrabold text-white leading-tight line-clamp-1">{item.name}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* CMYK Tab Content */
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-slate-600">Enter exact CMYK printing color values:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['C (Cyan)', 'M (Magenta)', 'Y (Yellow)', 'K (Black)'].map((label, idx) => (
                            <div key={idx} className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-700 block">{label.split(' ')[0]}</span>
                              <input type="number" min="0" max="100" defaultValue={[65, 80, 0, 0][idx]} className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => handleBackgroundChange('#751FB8')} className="w-full py-2 bg-[#0070e0] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer">
                          Apply CMYK Color
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB 6: QR-CODES --- */}
                {activeTab === 'QR-codes' && (
                  <div className="space-y-5 pb-6">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 mb-1">Add a QR Code</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-3.5">
                        Enter a valid website link, social profile, or menu URL. Customers can scan your QR code instantly using their phone camera.
                      </p>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">Website URL / Link</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={qrInput}
                            onChange={(e) => {
                              setQrInput(e.target.value);
                              if (qrError) setQrError('');
                            }}
                            placeholder="https://example.com or yourwebsite.com"
                            className={`w-full bg-white border rounded-xl py-2.5 pl-3.5 pr-8 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none shadow-2xs transition-all ${qrError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-300 focus:border-blue-500'
                              }`}
                          />
                          {qrInput && (
                            <button
                              onClick={() => {
                                setQrInput('');
                                setQrError('');
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                              title="Clear input"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Validation Error Banner */}
                        {qrError && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-600 shadow-2xs">
                            <span className="text-base font-extrabold leading-none">⚠</span>
                            <span className="text-[11px] font-bold leading-tight">{qrError}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    {(() => {
                      const QR_STYLES = [
                        { id: 'classic', name: 'Classic Minimal', color: '000000', bgcolor: 'ffffff', margin: 5 },
                        { id: 'royal-blue', name: 'Studio Blue', color: '0070e0', bgcolor: 'ffffff', margin: 5 },
                        { id: 'luxury-purple', name: 'Deep Purple', color: '751FB8', bgcolor: 'ffffff', margin: 5 },
                        { id: 'dark-carbon', name: 'Carbon Dark Mode', color: 'ffffff', bgcolor: '0f172a', margin: 5 },
                        { id: 'emerald-cream', name: 'Warm Cream Green', color: '065f46', bgcolor: 'fffbeb', margin: 8 },
                        { id: 'bold-yellow', name: 'High-Contrast Yellow', color: '000000', bgcolor: 'fde047', margin: 8 },
                        { id: 'rose-blush', name: 'Rose Berry Elegance', color: '831843', bgcolor: 'fdf2f8', margin: 5 },
                        { id: 'navy-sky', name: 'Corporate Navy Sky', color: '1e3a8a', bgcolor: 'f0f9ff', margin: 5 }
                      ];
                      const selectedStyleObj = QR_STYLES.find(s => s.id === qrStyle) || QR_STYLES[0];
                      const previewUrlInput = qrInput.trim().startsWith('http://') || qrInput.trim().startsWith('https://') || qrInput.trim().includes('.')
                        ? (qrInput.trim().startsWith('http://') || qrInput.trim().startsWith('https://') ? qrInput.trim() : 'https://' + qrInput.trim())
                        : qrInput.trim();

                      return (
                        <>
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                            <div
                              style={{ backgroundColor: `#${selectedStyleObj.bgcolor}` }}
                              className="w-36 h-36 rounded-xl border border-slate-200/80 p-2.5 shadow-2xs flex items-center justify-center transition-colors"
                            >
                              {qrInput.trim() && !qrError ? (
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(previewUrlInput)}&color=${selectedStyleObj.color}&bgcolor=${selectedStyleObj.bgcolor}&margin=${selectedStyleObj.margin}`}
                                  alt="QR Preview"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div style={{ color: `#${selectedStyleObj.color}` }} className="flex flex-col items-center justify-center gap-1.5 opacity-60">
                                  <span className="text-4xl">▦</span>
                                  <span className="text-[10px] font-bold">QR Preview</span>
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 truncate max-w-full px-2">
                              {qrInput.trim() ? `Link: ${qrInput.trim()}` : 'No valid link entered yet'}
                            </span>
                          </div>

                          {/* QR Code Styles & Designs Selection Grid */}
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800 mb-1">QR Code Design & Theme</h4>
                            <p className="text-[10px] text-slate-500 mb-3">Choose a style and color theme for your QR code:</p>
                            <div className="grid grid-cols-2 gap-2.5">
                              {QR_STYLES.map((style) => {
                                const isSelected = qrStyle === style.id;
                                const sampleData = qrInput.trim() ? previewUrlInput : 'https://example.com';
                                const sampleUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(sampleData)}&color=${style.color}&bgcolor=${style.bgcolor}&margin=${style.margin}`;
                                return (
                                  <button
                                    key={style.id}
                                    onClick={() => setQrStyle(style.id)}
                                    className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${isSelected
                                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20 shadow-2xs'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                      }`}
                                  >
                                    <div
                                      style={{ backgroundColor: `#${style.bgcolor}` }}
                                      className="w-11 h-11 rounded-lg border border-slate-200/80 p-1 shrink-0 flex items-center justify-center shadow-2xs"
                                    >
                                      <img src={sampleUrl} alt={style.name} className="w-full h-full object-contain pointer-events-none" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-[11px] font-extrabold text-slate-800 truncate">{style.name}</span>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span style={{ backgroundColor: `#${style.color}` }} className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs" title={`Foreground: #${style.color}`} />
                                        <span style={{ backgroundColor: `#${style.bgcolor}` }} className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs" title={`Background: #${style.bgcolor}`} />
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Generate & Add Button */}
                          <button
                            onClick={() => {
                              const s = qrInput.trim();
                              const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
                              if (!s || !urlPattern.test(s)) {
                                setQrError('Please enter a valid web link or URL (e.g., https://example.com or yourbusiness.com)');
                                return;
                              }
                              const finalUrl = s.startsWith('http://') || s.startsWith('https://') ? s : 'https://' + s;
                              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(finalUrl)}&color=${selectedStyleObj.color}&bgcolor=${selectedStyleObj.bgcolor}&margin=${selectedStyleObj.margin}`;
                              const newId = `el-qr-${Date.now()}`;
                              setCurrentElements(prev => [
                                ...prev,
                                {
                                  id: newId,
                                  type: 'image',
                                  url: qrImageUrl,
                                  label: `${selectedStyleObj.name} QR`,
                                  qrData: finalUrl,
                                  x: 150,
                                  y: 100,
                                  width: 110,
                                  height: 110,
                                  naturalWidth: 300,
                                  naturalHeight: 300
                                }
                              ]);
                              setSelectedId(newId);
                              setQrError('');
                            }}
                            className="w-full py-3.5 bg-[#0070e0] hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Add {selectedStyleObj.name} QR to Design</span>
                            <span>→</span>
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* --- TAB 6: TEMPLATE --- */}
                {activeTab === 'Template' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-700">Switch Layout Template</h4>
                    <p className="text-[11px] text-slate-500">Clicking a template switches color scheme and arrangement.</p>

                    <div className="space-y-3 pt-1">
                      {(() => {
                        const list = [...TEMPLATES_LIST];
                        const urlId = searchParams?.get('templateId');
                        const urlTitle = searchParams?.get('templateTitle');
                        const urlBg = searchParams?.get('bgImage');
                        const urlSize = searchParams?.get('size');
                        const urlOrient = searchParams?.get('orientation');
                        const urlColor = searchParams?.get('selectedColor');

                        if (urlId || urlBg) {
                          list.unshift({
                            id: urlId || 'custom-url-template',
                            name: urlTitle || 'Selected Design Template',
                            primaryColor: urlColor || '#2563EB',
                            bg: urlBg || '#ffffff',
                            style: 'Active Design',
                            size: urlSize,
                            orientation: urlOrient
                          });
                        }
                        return list.map((t) => {
                          const isActive = currentBackground === t.bg || searchParams?.get('templateId') === t.id;
                          return (
                            <div
                              key={t.id}
                              onClick={() => handleApplyTemplate(t)}
                              className={`p-3.5 rounded-2xl border cursor-pointer shadow-2xs transition-all ${isActive ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-extrabold text-slate-900">{t.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>{isActive ? '✓ Active Template' : t.style}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span style={{ backgroundColor: t.primaryColor }} className="w-5 h-5 rounded-full border border-slate-300 block shrink-0" />
                                {t.bg.startsWith('http') || t.bg.startsWith('/') ? (
                                  <div style={{ backgroundImage: `url("${t.bg}")` }} className="w-6 h-5 rounded border border-slate-300 bg-cover bg-center shrink-0" />
                                ) : (
                                  <span style={{ backgroundColor: t.bg }} className="w-5 h-5 rounded-full border border-slate-300 block shrink-0" />
                                )}
                                <span className="text-[11px] font-semibold text-slate-500 truncate">{isActive ? 'Current active design' : 'Click to apply design & sizing →'}</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* --- TAB 7: TEMPLATE COLOR --- */}
                {activeTab === 'Template color' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-700">Recolor Active Design Elements</h4>
                    <p className="text-[11px] text-slate-500">Select a primary color to instantly change all lines, headers and accents across your card.</p>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {[
                        { name: 'Royal Blue', hex: '#2563EB' },
                        { name: 'Deep Navy', hex: '#1e3a8a' },
                        { name: 'Emerald Gold', hex: '#10b981' },
                        { name: 'Crimson Rose', hex: '#e11d48' },
                        { name: 'Sunset Amber', hex: '#d97706' },
                        { name: 'Slate Gray', hex: '#475569' }
                      ].map((pal, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentElements(prev =>
                              prev.map(el => {
                                if (el.color && el.color !== '#64748b' && el.color !== '#334155') return { ...el, color: pal.hex };
                                if (el.fill && el.shapeType === 'line') return { ...el, fill: pal.hex };
                                return el;
                              })
                            );
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 flex flex-col items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800"
                        >
                          <span style={{ backgroundColor: pal.hex }} className="w-8 h-8 rounded-full border border-slate-300 block shadow-sm" />
                          <span>{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- TAB 8: MORE --- */}
                {activeTab === 'More' && (
                  <div className="space-y-4 text-center py-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto text-xl font-bold">
                      ⚡
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Advanced Studio Tools</h4>
                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                      QR Code Generator, Foil & Spot UV texture previews, and bulk variable printing tools will be enabled here when you run follow-up commands!
                    </p>
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* 3. CENTER CANVAS WORKSPACE (With Rulers, Bleed & Safety Area) */}
        <main
          className="flex-1 bg-[#E8ECEF] relative overflow-auto flex flex-col items-center justify-center p-6 sm:p-12"
          onMouseMove={handleMouseMoveOnCanvas}
          onMouseUp={handleMouseUpOnCanvas}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null);
              setEditingTextId(null);
            }
          }}
        >
          {/* Top Info Rulers & Bleed Toggles */}
          <div className="absolute top-4 inset-x-8 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs pointer-events-auto">
              <span>Ruler: <strong className="text-slate-800">{searchParams?.get('size') || (productOptions.orientation.includes('Vertical') ? '5.38cm x 9.18cm' : '9.18cm x 5.38cm')}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Zoom: <strong className="text-slate-800">{zoomLevel}%</strong></span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setShowSafetyArea(!showSafetyArea)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${showSafetyArea
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                Safety Area
              </button>
              <button
                onClick={() => setShowBleed(!showBleed)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${showBleed
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                Bleed
              </button>
            </div>
          </div>

          {/* Rulers visualization along top and left */}
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            className="relative transition-transform duration-200 flex items-center justify-center my-auto"
          >
            {/* Top Ruler Bar */}
            <div className="absolute -top-7 left-0 right-0 h-6 bg-white/80 border border-slate-300/80 rounded-t-md flex items-end justify-between px-2 text-[9px] font-extrabold text-slate-500 select-none">
              <span>0 cm</span>
              <span>2 cm</span>
              <span>4 cm</span>
              <span>6 cm</span>
              <span>8 cm</span>
              <span>9.18 cm</span>
            </div>

            {/* Left Ruler Bar */}
            <div className="absolute -left-7 top-0 bottom-0 w-6 bg-white/80 border border-slate-300/80 rounded-l-md flex flex-col items-center justify-between py-2 text-[9px] font-extrabold text-slate-500 select-none">
              <span>0</span>
              <span>2</span>
              <span>4</span>
              <span>5.38</span>
            </div>

            {/* THE ACTUAL PRINT CARD CANVAS (approx 620px x 350px scaled) */}
            <div
              ref={canvasRef}
              onClick={(e) => {
                if (e.target === canvasRef.current) {
                  setSelectedId(null);
                  setEditingTextId(null);
                }
              }}
              style={{
                width: getCanvasDimensions(productOptions.orientation, searchParams?.get('size')).width,
                height: getCanvasDimensions(productOptions.orientation, searchParams?.get('size')).height,
                ...getBackgroundStyles(currentBackground || '#ffffff'),
                borderRadius: productOptions.corners.includes('Rounded') ? '24px' : '0px'
              }}
              className={`relative shadow-2xl border border-slate-300 ${selectedId && !isPreviewMode ? 'overflow-visible' : 'overflow-hidden'} transition-all duration-300 shrink-0 group cursor-default ${productOptions.corners.includes('Rounded') ? 'rounded-3xl' : 'rounded-none'}`}
            >
              {/* Bleed Margin Overlay */}
              {showBleed && (
                <div className="absolute inset-2 border border-blue-400/40 pointer-events-none flex items-start justify-end p-1">
                  <span className="text-[9px] font-bold text-blue-500 bg-blue-50/90 px-1.5 rounded uppercase tracking-wider">Bleed</span>
                </div>
              )}

              {/* Safety Margin Overlay (dashed green box exactly like Vistaprint) */}
              {showSafetyArea && (
                <div className="absolute inset-7 border-2 border-dashed border-emerald-500/60 pointer-events-none flex items-end justify-end p-1.5 rounded-sm">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50/90 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">Safety Area</span>
                </div>
              )}

              {/* Render All Elements on Canvas */}
              {currentElements.map((el) => {
                const isSelected = selectedId === el.id;

                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleMouseDownOnElement(e, el)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (el.type === 'text') {
                        setSelectedId(el.id);
                        setEditingTextId(el.id);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (el.type === 'text') {
                        const distMoved = Math.hypot(
                          e.clientX - (dragStartPos.current.x || e.clientX),
                          e.clientY - (dragStartPos.current.y || e.clientY)
                        );
                        if (distMoved < 5) {
                          if (selectedId === el.id) {
                            setEditingTextId(el.id);
                          } else {
                            setSelectedId(el.id);
                          }
                          return;
                        }
                      }
                      setSelectedId(el.id);
                    }}
                    style={{
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      width: el.width ? `${el.width}px` : 'auto',
                      height: el.height ? `${el.height}px` : 'auto',
                      zIndex: isSelected ? 50 : 10
                    }}
                    className={`absolute select-none group/el cursor-move transition-shadow ${isSelected ? 'ring-2 ring-blue-600 shadow-lg bg-blue-50/10 rounded-lg p-1' : 'hover:ring-1 hover:ring-blue-300/80 p-1'
                      }`}
                  >
                    {/* Floating Toolbar when selected */}
                    {isSelected && !isPreviewMode && (
                      el.type === 'text' ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            ...(el.y < 52
                              ? { top: '100%', marginTop: '8px' }
                              : { bottom: '100%', marginBottom: '10px' })
                          }}
                          className="absolute bg-white text-slate-800 rounded-xl px-2.5 py-1.5 flex flex-wrap items-center justify-center gap-1.5 shadow-2xl border border-slate-200/90 z-50 text-xs w-max pointer-events-auto"
                        >
                          {/* Font Family */}
                          <select
                            value={el.fontFamily || 'Fira Sans'}
                            onChange={(e) => updateSelectedProperty('fontFamily', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer w-28 max-w-[110px]"
                          >
                            {FONT_FAMILIES.map(font => (
                              <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                            ))}
                          </select>

                          {/* Font Size */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                            <button
                              type="button"
                              onClick={() => updateSelectedProperty('fontSize', Math.max(8, (el.fontSize || 16) - 2))}
                              className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={el.fontSize || 16}
                              onChange={(e) => updateSelectedProperty('fontSize', parseInt(e.target.value) || 16)}
                              className="w-9 text-center text-xs font-black border-x border-slate-200 py-1 bg-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateSelectedProperty('fontSize', Math.min(120, (el.fontSize || 16) + 2))}
                              className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Bold */}
                          <button
                            type="button"
                            onClick={() => updateSelectedProperty('bold', !el.bold)}
                            className={`w-7 h-7 rounded-lg font-black flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer ${el.bold ? 'bg-blue-600 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            title="Bold"
                          >
                            B
                          </button>

                          {/* Italic */}
                          <button
                            type="button"
                            onClick={() => updateSelectedProperty('italic', !el.italic)}
                            className={`w-7 h-7 rounded-lg italic font-bold flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer ${el.italic ? 'bg-blue-600 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            title="Italic"
                          >
                            I
                          </button>

                          {/* Underline */}
                          <button
                            type="button"
                            onClick={() => updateSelectedProperty('underline', !el.underline)}
                            className={`w-7 h-7 rounded-lg underline font-bold flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer ${el.underline ? 'bg-blue-600 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            title="Underline"
                          >
                            U
                          </button>

                          {/* Text Color */}
                          <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-slate-100 shrink-0 border border-slate-200/60 bg-white" title="Text Color">
                            <input
                              type="color"
                              value={el.color || el.fill || '#1e293b'}
                              onChange={(e) => {
                                updateSelectedProperty('color', e.target.value);
                                updateSelectedProperty('fill', e.target.value);
                              }}
                              className="w-5 h-5 rounded-full cursor-pointer border border-slate-300 p-0 overflow-hidden"
                            />
                          </div>

                          {/* Alignments */}
                          <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50 shrink-0">
                            {['left', 'center', 'right'].map((align) => (
                              <button
                                key={align}
                                type="button"
                                onClick={() => updateSelectedProperty('align', align)}
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors cursor-pointer ${el.align === align ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'hover:bg-slate-200 text-slate-600'
                                  }`}
                                title={`Align ${align}`}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  {align === 'left' && <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" />}
                                  {align === 'center' && <path d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm-3 7h18v2H3v-2z" />}
                                  {align === 'right' && <path d="M3 4h18v2H3V4zm6 7h12v2H9v-2zm-6 7h18v2H3v-2z" />}
                                </svg>
                              </button>
                            ))}
                          </div>

                          {/* Format Dropdown & Menu (Case Popover) */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFormatMenu(!showFormatMenu);
                              }}
                              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${showFormatMenu || (el.textCase && el.textCase !== 'none')
                                  ? 'bg-blue-100 text-blue-700 font-extrabold border border-blue-300 shadow-2xs'
                                  : 'hover:bg-slate-100 text-slate-700 border border-slate-200/60 bg-white'
                                }`}
                              title="Format Case (Uppercase, Lowercase, Normal)"
                            >
                              <span className="text-[11px]">T🗚</span>
                              <span className="hidden sm:inline">Format</span>
                            </button>

                            {/* Case Popover Menu */}
                            {showFormatMenu && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 flex items-center gap-3.5 whitespace-nowrap min-w-[190px]"
                              >
                                <span className="text-xs font-extrabold text-slate-800">Case</span>

                                <div className="flex items-center gap-1.5">
                                  {/* Normal / As Typed Case (Aa) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSelectedProperty('textCase', 'none');
                                      setShowFormatMenu(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${!el.textCase || el.textCase === 'none'
                                        ? 'bg-sky-50 text-blue-900 border-2 border-blue-600 shadow-2xs'
                                        : 'text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                                      }`}
                                    title="Normal / As Typed"
                                  >
                                    Aa
                                  </button>

                                  {/* Lowercase (a↓) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSelectedProperty('textCase', 'lowercase');
                                      setShowFormatMenu(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-0.5 justify-center cursor-pointer ${el.textCase === 'lowercase'
                                        ? 'bg-sky-50 text-blue-900 border-2 border-blue-600 shadow-2xs'
                                        : 'text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                                      }`}
                                    title="Lowercase"
                                  >
                                    <span>a</span>
                                    <span className="text-xs font-black">↓</span>
                                  </button>

                                  {/* Uppercase (A↑) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSelectedProperty('textCase', 'uppercase');
                                      setShowFormatMenu(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-0.5 justify-center cursor-pointer ${el.textCase === 'uppercase'
                                        ? 'bg-sky-50 text-blue-900 border-2 border-blue-600 shadow-2xs'
                                        : 'text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                                      }`}
                                    title="Uppercase"
                                  >
                                    <span>A</span>
                                    <span className="text-xs font-black">↑</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Effects Button */}
                          <button
                            type="button"
                            onClick={() => setActiveTab(activeTab === 'Effects' ? 'Text' : 'Effects')}
                            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${activeTab === 'Effects' || (el.effect && el.effect !== 'none' && el.effect !== 'original') || (el.textShape && el.textShape !== 'none')
                                ? 'bg-blue-100 text-blue-700 font-extrabold border border-blue-300 shadow-2xs'
                                : 'hover:bg-slate-100 text-slate-700 border border-slate-200/60 bg-white'
                              }`}
                            title="Text Effects & Shapes"
                          >
                            <span>✨</span>
                            <span className="hidden sm:inline">Effects</span>
                          </button>

                          {/* Duplicate & Delete */}
                          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDuplicateElement(el)}
                              title="Duplicate"
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                            >
                              ❐
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteElement(el.id)}
                              title="Delete"
                              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-rose-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            ...(el.y < 44
                              ? { top: '100%', marginTop: '8px' }
                              : { bottom: '100%', marginBottom: '8px' })
                          }}
                          className="absolute bg-slate-900 text-white rounded-lg px-2.5 py-1.5 flex items-center gap-2 shadow-xl z-50 text-xs w-max pointer-events-auto"
                        >
                          <span className="font-extrabold truncate max-w-[100px] text-[10px] text-sky-300">{el.label || el.type}</span>
                          {el.type === 'shape' && (
                            <div className="flex items-center gap-1.5 px-1 bg-slate-800 rounded">
                              <span className="text-[10px] text-slate-300 font-semibold">Fill:</span>
                              <input
                                type="color"
                                value={el.fill || '#2563EB'}
                                onChange={(e) => updateSelectedProperty('fill', e.target.value)}
                                className="w-5 h-5 rounded-full cursor-pointer border border-slate-600 p-0 overflow-hidden"
                              />
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateElement(el);
                            }}
                            title="Duplicate"
                            className="hover:text-blue-400 cursor-pointer"
                          >
                            ❐
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(el.id);
                            }}
                            title="Delete"
                            className="hover:text-rose-400 cursor-pointer"
                          >
                            🗑
                          </button>
                        </div>
                      )
                    )}

                    {/* Element Rendered Content */}
                    {el.type === 'image' ? (
                      <img
                        src={el.url}
                        alt={el.label || 'Uploaded image'}
                        draggable={false}
                        className="w-full h-full object-contain rounded-md pointer-events-none select-none"
                      />
                    ) : el.type === 'svg' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: el.svgContent || '' }}
                        className="w-full h-full flex items-center justify-center pointer-events-none select-none [&>svg]:w-full [&>svg]:h-full"
                      />
                    ) : el.type === 'text' ? (() => {
                      // Compute Text Effect Styles
                      let textShadow = 'none';
                      let bgColor = 'transparent';
                      let padding = '0px';
                      let borderRadius = '0px';

                      if (el.effect === 'shadow') {
                        const dist = el.shadowDistance !== undefined ? el.shadowDistance : 10;
                        const angleRad = ((el.shadowAngle !== undefined ? el.shadowAngle : 35) * Math.PI) / 180;
                        const offsetX = Math.round(dist * Math.cos(angleRad));
                        const offsetY = Math.round(dist * Math.sin(angleRad));
                        const blur = el.shadowBlur !== undefined ? el.shadowBlur : 10;
                        const opacity = (el.shadowOpacity !== undefined ? el.shadowOpacity : 40) / 100;
                        const hex = el.shadowColor || '#000000';
                        const r = parseInt(hex.slice(1, 3) || '00', 16);
                        const g = parseInt(hex.slice(3, 5) || '00', 16);
                        const b = parseInt(hex.slice(5, 7) || '00', 16);
                        textShadow = `${offsetX}px ${offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;
                      } else if (el.effect === 'highlight') {
                        const hex = el.highlightColor || '#dbeafe';
                        const opacity = (el.highlightOpacity !== undefined ? el.highlightOpacity : 80) / 100;
                        const r = parseInt(hex.slice(1, 3) || 'db', 16);
                        const g = parseInt(hex.slice(3, 5) || 'ea', 16);
                        const b = parseInt(hex.slice(5, 7) || 'fe', 16);
                        bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        padding = '2px 6px';
                        borderRadius = '4px';
                      } else if (el.effect === 'glitch') {
                        const offset = el.effectIntensity !== undefined ? el.effectIntensity : 4;
                        textShadow = `-${offset}px 0px 0px #06b6d4, ${offset}px 0px 0px #ec4899`;
                      } else if (el.effect === 'echo') {
                        const intensity = el.effectIntensity !== undefined ? el.effectIntensity : 4;
                        textShadow = `${intensity}px ${intensity}px 0px rgba(0,0,0,0.35), ${intensity * 2}px ${intensity * 2}px 0px rgba(0,0,0,0.2), ${intensity * 3}px ${intensity * 3}px 0px rgba(0,0,0,0.1)`;
                      }

                      const isCurved = el.textShape === 'curve';
                      const isEditingInline = editingTextId === el.id && !isPreviewMode;

                      if (isEditingInline) {
                        return (
                          <div
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              transform: isCurved ? `perspective(400px) rotateX(${el.curveRadius !== undefined ? el.curveRadius : 30}deg)` : 'none'
                            }}
                            className="w-full relative"
                          >
                            <textarea
                              autoFocus
                              ref={(node) => {
                                if (node && document.activeElement !== node) {
                                  node.focus();
                                  const len = node.value.length;
                                  node.setSelectionRange(len, len);
                                }
                              }}
                              value={el.text}
                              onChange={(e) => updateSelectedProperty('text', e.target.value)}
                              onBlur={() => {
                                setEditingTextId(null);
                                saveToHistory();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setEditingTextId(null);
                                }
                                e.stopPropagation();
                              }}
                              style={{
                                width: '100%',
                                fontSize: `${el.fontSize || 16}px`,
                                fontFamily: el.fontFamily || 'Fira Sans',
                                color: el.color || '#0f172a',
                                fontWeight: el.bold ? 'bold' : 'normal',
                                fontStyle: el.italic ? 'italic' : 'normal',
                                textDecoration: el.underline ? 'underline' : 'none',
                                textAlign: el.align || 'left',
                                textTransform: el.textCase || 'none',
                                textShadow: textShadow,
                                backgroundColor: bgColor,
                                padding: padding,
                                borderRadius: borderRadius,
                                lineHeight: 1.25,
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                resize: 'none',
                                overflow: 'hidden',
                                display: 'block'
                              }}
                              rows={Math.max(1, (el.text || '').split('\n').length)}
                              placeholder="Type text right here..."
                              className="break-words font-sans focus:outline-none focus:ring-0 cursor-text transition-none"
                            />
                          </div>
                        );
                      }

                      return (
                        <div
                          style={{
                            fontSize: `${el.fontSize || 16}px`,
                            fontFamily: el.fontFamily || 'Fira Sans',
                            color: el.color || '#0f172a',
                            fontWeight: el.bold ? 'bold' : 'normal',
                            fontStyle: el.italic ? 'italic' : 'normal',
                            textDecoration: el.underline ? 'underline' : 'none',
                            textAlign: el.align || 'left',
                            textTransform: el.textCase || 'none',
                            textShadow: textShadow,
                            backgroundColor: bgColor,
                            padding: padding,
                            borderRadius: borderRadius,
                            lineHeight: 1.25,
                            whiteSpace: 'pre-wrap',
                            transform: isCurved ? `perspective(400px) rotateX(${el.curveRadius !== undefined ? el.curveRadius : 30}deg)` : 'none'
                          }}
                          className="w-full break-words transition-all"
                        >
                          {isCurved ? (
                            <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
                              <path id={`curve-${el.id}`} d="M 10,90 Q 150,-20 290,90" fill="transparent" />
                              <text fill={el.color || '#0f172a'} style={{ fontSize: `${el.fontSize || 16}px`, fontFamily: el.fontFamily || 'Fira Sans', fontWeight: el.bold ? 'bold' : 'normal', textTransform: el.textCase || 'none', textShadow: textShadow }}>
                                <textPath href={`#curve-${el.id}`} startOffset="50%" textAnchor="middle">
                                  {el.text || 'Curve Text'}
                                </textPath>
                              </text>
                            </svg>
                          ) : (
                            el.text || 'Text Field'
                          )}
                        </div>
                      );
                    })() : el.shapeType === 'placeholder' ? (
                      <div
                        style={{ backgroundColor: el.fill || '#e2e8f0', color: el.color || '#64748b', fontSize: `${el.fontSize || 14}px` }}
                        className="w-full h-full rounded-xl flex items-center justify-center text-center font-bold p-2 whitespace-pre-line shadow-inner border border-slate-300/60"
                      >
                        {el.text || 'Placeholder'}
                      </div>
                    ) : (
                      renderShapeIcon(el.shapeType, el.fill || '#000000')
                    )}

                    {/* Resize Handles (Corners) when selected */}
                    {isSelected && !isPreviewMode && (
                      <>
                        <span onMouseDown={(e) => handleResizeMouseDown(e, el)} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize z-50 hover:bg-blue-600 hover:scale-125 transition-transform" />
                        <span onMouseDown={(e) => handleResizeMouseDown(e, el)} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize z-50 hover:bg-blue-600 hover:scale-125 transition-transform" />
                        <span onMouseDown={(e) => handleResizeMouseDown(e, el)} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize z-50 hover:bg-blue-600 hover:scale-125 transition-transform" />
                        <span onMouseDown={(e) => handleResizeMouseDown(e, el)} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize z-50 hover:bg-blue-600 hover:scale-125 transition-transform" title="Drag corner to resize" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Zoom / Canvas Toolbar */}
          <div className="absolute bottom-6 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-lg flex items-center gap-4 z-20">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm"
            >
              −
            </button>
            <span className="text-xs font-black text-slate-800 min-w-[40px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm"
            >
              +
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button
              onClick={() => setZoomLevel(100)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset 100%
            </button>
          </div>
        </main>

        {!isPreviewMode && (
          /* 4. RIGHT SIDEBAR THUMBNAILS (Front / Back side switcher - Replicating screenshot right panel!) */
          <aside className="w-44 bg-white border-l border-slate-200 p-4 flex flex-col justify-between shrink-0 z-30 shadow-xs">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Card Sides
              </h3>

              {/* Front Side Button / Preview */}
              <div
                onClick={() => setActiveSide('Front')}
                className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${activeSide === 'Front'
                  ? 'border-[#0070e0] bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
              >
                {renderDesignPreview(frontElements, frontBackground, productOptions.corners, productOptions.orientation, searchParams?.get('size'), 120)}
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className={`text-xs font-black ${activeSide === 'Front' ? 'text-[#0070e0]' : 'text-slate-700'}`}>
                    Front
                  </span>
                  {activeSide === 'Front' && <span className="w-2 h-2 rounded-full bg-[#0070e0]" />}
                </div>
              </div>

              {/* Back Side Button / Preview */}
              <div
                onClick={() => setActiveSide('Back')}
                className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${activeSide === 'Back'
                  ? 'border-[#0070e0] bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
              >
                {renderDesignPreview(backElements, backBackground, productOptions.corners, productOptions.orientation, searchParams?.get('size'), 120)}
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className={`text-xs font-black ${activeSide === 'Back' ? 'text-[#0070e0]' : 'text-slate-700'}`}>
                    Back
                  </span>
                  {activeSide === 'Back' && <span className="w-2 h-2 rounded-full bg-[#0070e0]" />}
                </div>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* 5. NEXT / ORDER SUMMARY CONFIRMATION MODAL */}
      {/* 5. REVIEW YOUR DESIGN MODAL (Exact match to user's requested layout & screenshot) */}
      {showNextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden relative my-auto max-h-[92vh]">

            {/* Close Button top right */}
            <button
              onClick={() => setShowNextModal(false)}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer text-base"
              title="Close"
            >
              ✕
            </button>

            {/* LEFT COLUMN: Visual Preview Cards (Front & Back) & Circular Zoom Bubble */}
            <div className="w-full lg:w-3/5 bg-slate-100/80 p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[520px] sm:min-h-[660px] overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200/60">

              <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 py-4 my-auto">

                {/* 1. FRONT SIDE PREVIEW */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    Front Side Preview
                  </span>
                  {renderDesignPreview(frontElements, frontBackground, productOptions.corners, productOptions.orientation, searchParams?.get('size'), 380)}
                </div>

                {/* 2. BACK SIDE PREVIEW */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    Back Side Preview
                  </span>
                  {renderDesignPreview(backElements, backBackground, productOptions.corners, productOptions.orientation, searchParams?.get('size'), 380)}
                </div>

              </div>

              {/* Pill Indicator */}
              <div className="mt-4 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-extrabold text-slate-700 flex items-center gap-2 z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isBackCustomized ? 'Double Sided Design' : 'Single Sided Design'} • {productOptions.quantity.split(' -')[0]}</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Conditional Step 1 (Review) vs Step 2 (Final Steps) */}
            <div className="w-full lg:w-2/5 p-6 sm:p-8 sm:pt-10 flex flex-col justify-between overflow-y-auto">
              {reviewStep === 'review' ? (
                <>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Review your design</h2>
                    <p className="text-xs font-semibold text-slate-600 mb-6">Double-check the following details before you continue.</p>

                    {/* Bullet Checklist */}
                    <ul className="space-y-2.5 text-xs font-bold text-slate-700 mb-6">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span>Text is clear and easy to read</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span>Information is spelled correctly</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span>Images are sharp with no blurring</span>
                      </li>
                    </ul>

                    {/* Perfecting your designs Banner */}
                    <div className="bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 mb-6">
                      <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 mb-1">
                        <span className="text-sm">🛡</span>
                        <span>Perfecting your designs</span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        Our design team will review your design to ensure optimal results for printing. We'll send you the updated version via email.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Authorization Checkbox & Buttons */}
                  <div className="mt-auto pt-4 space-y-3.5 border-t border-slate-100">
                    <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasApprovedDesign}
                        onChange={(e) => setHasApprovedDesign(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#38bdf8] focus:ring-[#38bdf8] cursor-pointer shrink-0"
                      />
                      <span className="leading-tight">I have authorization to use the design, I have reviewed and approve it.</span>
                    </label>

                    <button
                      onClick={() => {
                        setReviewStep('final');
                      }}
                      disabled={!hasApprovedDesign}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:opacity-40 disabled:hover:bg-[#38bdf8] disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                    >
                      Continue
                    </button>

                    <button
                      onClick={() => setShowNextModal(false)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Edit my design
                    </button>
                  </div>
                </>
              ) : (
                /* STEP 2: FINAL STEPS */
                <>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Final Steps</h2>
                    <p className="text-xs font-semibold text-slate-600 mb-6 leading-relaxed">
                      Almost done! Make selections below to finalize your design. Have questions? Call us at 02522-669393.
                    </p>

                    {/* Quantity Field */}
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity*</label>
                      <select
                        value={productOptions.quantity}
                        onChange={(e) => setProductOptions({ ...productOptions, quantity: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent cursor-pointer shadow-2xs"
                      >
                        <option>100 cards - ₹200.00</option>
                        <option>250 cards - ₹450.00 (Save 10%)</option>
                        <option>500 cards - ₹800.00 (Save 20%)</option>
                        <option>1,000 cards - ₹1,400.00 (Save 30%)</option>
                      </select>
                    </div>

                    {/* Stock Field */}
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Stock*</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Standard Matte (300 gsm)', label: 'Standard', priceLabel: 'Included' },
                          { name: 'Premium Gloss Coated (350 gsm)', label: 'Premium', priceLabel: '+₹75.00' }
                        ].map((stockOption) => {
                          const isSelected = productOptions.stock === stockOption.name || (stockOption.label === 'Standard' && productOptions.stock.includes('Standard')) || (stockOption.label === 'Premium' && productOptions.stock.includes('Premium'));
                          return (
                            <button
                              key={stockOption.name}
                              type="button"
                              onClick={() => setProductOptions({ ...productOptions, stock: stockOption.name })}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                  ? 'bg-sky-50/70 border-2 border-[#38bdf8] text-slate-900 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                              <span className="font-extrabold text-xs block">{stockOption.label}</span>
                              <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-400 font-normal'}`}>
                                {stockOption.priceLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Price Summary & Add to Cart */}
                  <div className="mt-auto pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">
                          ₹{(totalPrice + (productOptions.stock.includes('Premium') ? 75 : 0)).toFixed(2)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {productOptions.quantity.split(' -')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">No setup fee</div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 mt-1">
                        <span>🚚 Delivery to 110001</span>
                        <span className="underline text-slate-800 cursor-pointer font-semibold">Review delivery options</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const finalPrice = totalPrice + (productOptions.stock.includes('Premium') ? 75 : 0);
                        const cartItem = {
                          productId: `custom_studio_${Date.now()}`,
                          title: `Custom Studio Design (${isBackCustomized ? 'Double Sided' : 'Single Sided'})`,
                          price: finalPrice,
                          qtyOption: productOptions.quantity.split(' -')[0],
                          quality: `${productOptions.stock.includes('Premium') ? 'Premium Gloss Coated (350 gsm)' : 'Standard Matte (300 gsm)'} • ${productOptions.corners}`,
                          style: isBackCustomized ? 'Double Sided Custom Print' : 'Single Sided Custom Print',
                          image: frontElements.find(e => e.type === 'image')?.url || '/home/visiting-cards/card-stack.png',
                          quantity: 1,
                          customDesign: {
                            frontElements,
                            backElements,
                            frontBackground,
                            backBackground,
                            productOptions: {
                              ...productOptions,
                              size: searchParams?.get('size') || productOptions.size || '91.8mm x 53.8mm',
                              orientation: productOptions.orientation || 'Horizontal',
                              stock: productOptions.stock.includes('Premium') ? 'Premium Gloss Coated (350 gsm)' : 'Standard Matte (300 gsm)'
                            },
                            isBackCustomized,
                            corners: productOptions.corners
                          }
                        };
                        addToCart(null, cartItem);
                        fetch('/api/auth/me').then(res => res.json()).then(data => {
                          if (data?.user?.id) {
                            addToCart(data.user.id, cartItem);
                          }
                        }).catch(() => { }).finally(() => {
                          setShowNextModal(false);
                          router.push('/cart');
                        });
                      }}
                      className="w-full sm:w-auto bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                    >
                      Add to Cart
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function CustomEditorPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-bold">Loading Studio Editor...</div>}>
      <StudioEditorContent />
    </Suspense>
  );
}
