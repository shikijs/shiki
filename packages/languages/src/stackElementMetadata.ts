/**
 * Helpers to manage the "collapsed" metadata of an entire StackElement stack.
 * The following assumptions have been made:
 *  - languageId < 256 => needs 8 bits
 *  - unique color count < 512 => needs 9 bits
 *
 * The binary format is:
 * - -------------------------------------------
 *     3322 2222 2222 1111 1111 1100 0000 0000
 *     1098 7654 3210 9876 5432 1098 7654 3210
 * - -------------------------------------------
 *     xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx
 *     bbbb bbbb bfff ffff ffFF FTTT LLLL LLLL
 * - -------------------------------------------
 *  - L = LanguageId (8 bits)
 *  - T = StandardTokenType (3 bits)
 *  - F = FontStyle (3 bits)
 *  - f = foreground color (9 bits)
 *  - b = background color (9 bits)
 */
export const enum MetadataConsts {
  LANGUAGEID_MASK = 0b00000000000000000000000011111111,
  TOKEN_TYPE_MASK = 0b00000000000000000000011100000000,
  FONT_STYLE_MASK = 0b00000000000000000011100000000000,
  FOREGROUND_MASK = 0b00000000011111111100000000000000,
  BACKGROUND_MASK = 0b11111111100000000000000000000000,

  LANGUAGEID_OFFSET = 0,
  TOKEN_TYPE_OFFSET = 8,
  FONT_STYLE_OFFSET = 11,
  FOREGROUND_OFFSET = 14,
  BACKGROUND_OFFSET = 23
}

export const enum TemporaryStandardTokenType {
  Other = 0,
  Comment = 1,
  String = 2,
  RegEx = 4,
  MetaEmbedded = 8
}

export const enum FontStyle {
  NotSet = -1,
  None = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4
}

export const enum StandardTokenType {
  Other = 0,
  Comment = 1,
  String = 2,
  RegEx = 4
}

export class StackElementMetadata {
  public static toBinaryStr(metadata: number): string {
    let r = metadata.toString(2)
    while (r.length < 32) {
      r = '0' + r
    }
    return r
  }

  public static printMetadata(metadata: number): void {
    let languageId = StackElementMetadata.getLanguageId(metadata)
    let tokenType = StackElementMetadata.getTokenType(metadata)
    let fontStyle = StackElementMetadata.getFontStyle(metadata)
    let foreground = StackElementMetadata.getForeground(metadata)
    let background = StackElementMetadata.getBackground(metadata)

    console.log({
      languageId: languageId,
      tokenType: tokenType,
      fontStyle: fontStyle,
      foreground: foreground,
      background: background
    })
  }

  public static getLanguageId(metadata: number): number {
    return (metadata & MetadataConsts.LANGUAGEID_MASK) >>> MetadataConsts.LANGUAGEID_OFFSET
  }

  public static getTokenType(metadata: number): number {
    return (metadata & MetadataConsts.TOKEN_TYPE_MASK) >>> MetadataConsts.TOKEN_TYPE_OFFSET
  }

  public static getFontStyle(metadata: number): number {
    return (metadata & MetadataConsts.FONT_STYLE_MASK) >>> MetadataConsts.FONT_STYLE_OFFSET
  }

  public static getForeground(metadata: number): number {
    return (metadata & MetadataConsts.FOREGROUND_MASK) >>> MetadataConsts.FOREGROUND_OFFSET
  }

  public static getBackground(metadata: number): number {
    return (metadata & MetadataConsts.BACKGROUND_MASK) >>> MetadataConsts.BACKGROUND_OFFSET
  }

  public static set(
    metadata: number,
    languageId: number,
    tokenType: TemporaryStandardTokenType,
    fontStyle: FontStyle,
    foreground: number,
    background: number
  ): number {
    let _languageId = StackElementMetadata.getLanguageId(metadata)
    let _tokenType = StackElementMetadata.getTokenType(metadata)
    let _fontStyle = StackElementMetadata.getFontStyle(metadata)
    let _foreground = StackElementMetadata.getForeground(metadata)
    let _background = StackElementMetadata.getBackground(metadata)

    if (languageId !== 0) {
      _languageId = languageId
    }
    if (tokenType !== TemporaryStandardTokenType.Other) {
      _tokenType =
        tokenType === TemporaryStandardTokenType.MetaEmbedded ? StandardTokenType.Other : tokenType
    }
    if (fontStyle !== FontStyle.NotSet) {
      _fontStyle = fontStyle
    }
    if (foreground !== 0) {
      _foreground = foreground
    }
    if (background !== 0) {
      _background = background
    }

    return (
      ((_languageId << MetadataConsts.LANGUAGEID_OFFSET) |
        (_tokenType << MetadataConsts.TOKEN_TYPE_OFFSET) |
        (_fontStyle << MetadataConsts.FONT_STYLE_OFFSET) |
        (_foreground << MetadataConsts.FOREGROUND_OFFSET) |
        (_background << MetadataConsts.BACKGROUND_OFFSET)) >>>
      0
    )
  }
}
