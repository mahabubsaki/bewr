import { Font } from "@react-pdf/renderer";
import type { DocumentFontId } from "../lib/fontConfig";
import { getPdfDocumentFontFamily as resolvePdfFontFamily } from "../lib/fontConfig";

import RobotoRegular from "../assets/font/roboto/Roboto-Regular.ttf";
import RobotoBold from "../assets/font/roboto/Roboto-Bold.ttf";
import RobotoItalic from "../assets/font/roboto/Roboto-Italic.ttf";

import ArialRegular from "../assets/font/arial/ARIAL.TTF";
import ArialBold from "../assets/font/arial/ARIALBD.TTF";
import ArialItalic from "../assets/font/arial/ARIALI.TTF";
import ArialBoldItalic from "../assets/font/arial/ARIALBI.TTF";

import CalibriRegular from "../assets/font/calibri-font-family/calibri-regular.ttf";
import CalibriBold from "../assets/font/calibri-font-family/calibri-bold.ttf";
import CalibriItalic from "../assets/font/calibri-font-family/calibri-italic.ttf";
import CalibriBoldItalic from "../assets/font/calibri-font-family/calibri-bold-italic.ttf";

import CambriaRegular from "../assets/font/cambria/Cambria.ttf";
import CambriaBold from "../assets/font/cambria/cambriab.ttf";
import CambriaItalic from "../assets/font/cambria/CAMBRIAI.TTF";

import GeorgiaRegular from "../assets/font/georgia-2/georgia.ttf";
import GeorgiaBold from "../assets/font/georgia-2/georgiab.ttf";
import GeorgiaItalic from "../assets/font/georgia-2/georgiai.ttf";
import GeorgiaBoldItalic from "../assets/font/georgia-2/georgiaz.ttf";

import GaramondRegular from "../assets/font/garamond/garamond_[allfont.ru].ttf";

import HelveticaRegular from "../assets/font/helvetica-255/Helvetica.ttf";
import HelveticaBold from "../assets/font/helvetica-255/Helvetica-Bold.ttf";
import HelveticaItalic from "../assets/font/helvetica-255/Helvetica-Oblique.ttf";
import HelveticaBoldItalic from "../assets/font/helvetica-255/Helvetica-BoldOblique.ttf";

import TimesRegular from "../assets/font/times_new_roman/times.ttf";

const DANCING_SCRIPT_URL =
  "https://fonts.gstatic.com/s/dancingscript/v8/DK0eTGXiZjN6yA8zAEyM2S5FJMZltoAAwO2fP7iHu2o.ttf";

let alreadyRegistered = false;

export function registerPdfFonts() {
  if (alreadyRegistered) return;

  Font.register({
    family: "DocRoboto",
    fonts: [
      { src: RobotoRegular, fontWeight: 400 },
      { src: RobotoBold, fontWeight: 700 },
      { src: RobotoItalic, fontStyle: "italic", fontWeight: 400 },
    ],
  });

  Font.register({
    family: "DocArial",
    fonts: [
      { src: ArialRegular, fontWeight: 400 },
      { src: ArialBold, fontWeight: 700 },
      { src: ArialItalic, fontStyle: "italic", fontWeight: 400 },
      { src: ArialBoldItalic, fontStyle: "italic", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "DocCalibri",
    fonts: [
      { src: CalibriRegular, fontWeight: 400 },
      { src: CalibriBold, fontWeight: 700 },
      { src: CalibriItalic, fontStyle: "italic", fontWeight: 400 },
      { src: CalibriBoldItalic, fontStyle: "italic", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "DocCambria",
    fonts: [
      { src: CambriaRegular, fontWeight: 400 },
      { src: CambriaBold, fontWeight: 700 },
      { src: CambriaItalic, fontStyle: "italic", fontWeight: 400 },
    ],
  });

  Font.register({
    family: "DocGeorgia",
    fonts: [
      { src: GeorgiaRegular, fontWeight: 400 },
      { src: GeorgiaBold, fontWeight: 700 },
      { src: GeorgiaItalic, fontStyle: "italic", fontWeight: 400 },
      { src: GeorgiaBoldItalic, fontStyle: "italic", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "DocGaramond",
    fonts: [{ src: GaramondRegular, fontWeight: 400 }],
  });

  Font.register({
    family: "DocHelvetica",
    fonts: [
      { src: HelveticaRegular, fontWeight: 400 },
      { src: HelveticaBold, fontWeight: 700 },
      { src: HelveticaItalic, fontStyle: "italic", fontWeight: 400 },
      { src: HelveticaBoldItalic, fontStyle: "italic", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "DocTimesNewRoman",
    fonts: [{ src: TimesRegular, fontWeight: 400 }],
  });

  Font.register({
    family: "DancingScript",
    src: DANCING_SCRIPT_URL,
  });

  Font.registerHyphenationCallback((word) => [word]);

  alreadyRegistered = true;
}

export function getPdfDocumentFontFamily(fontId: DocumentFontId): string {
  return resolvePdfFontFamily(fontId);
}
