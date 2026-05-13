export interface MatchSeed {
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  match_date: string
  stage: string
  group_name?: string
  venue: string
  match_number: number
}

// World Cup 2026 - 104 matches
// Group stage: 12 groups × 3 matches = 36 matches (actually 48 teams = 12 groups of 4 = 48 matches)
// Knockout: 32+16+8+4+2+1 = 63 matches + 3rd place
export const WC2026_MATCHES: MatchSeed[] = [
  // === GROUP A ===
  { match_number: 1, home_team: 'מקסיקו', away_team: 'אקוודור', home_flag: '🇲🇽', away_flag: '🇪🇨', match_date: '2026-06-11T22:00:00-05:00', stage: 'group', group_name: 'A', venue: 'מקסיקו סיטי' },
  { match_number: 2, home_team: 'ארה"ב', away_team: 'בוליביה', home_flag: '🇺🇸', away_flag: '🇧🇴', match_date: '2026-06-12T19:00:00-05:00', stage: 'group', group_name: 'A', venue: 'לוס אנג\'לס' },
  { match_number: 3, home_team: 'מקסיקו', away_team: 'ארה"ב', home_flag: '🇲🇽', away_flag: '🇺🇸', match_date: '2026-06-19T22:00:00-05:00', stage: 'group', group_name: 'A', venue: 'מקסיקו סיטי' },
  { match_number: 4, home_team: 'בוליביה', away_team: 'אקוודור', home_flag: '🇧🇴', away_flag: '🇪🇨', match_date: '2026-06-19T19:00:00-05:00', stage: 'group', group_name: 'A', venue: 'דאלאס' },
  { match_number: 5, home_team: 'ארה"ב', away_team: 'אקוודור', home_flag: '🇺🇸', away_flag: '🇪🇨', match_date: '2026-06-25T22:00:00-05:00', stage: 'group', group_name: 'A', venue: 'לוס אנג\'לס' },
  { match_number: 6, home_team: 'בוליביה', away_team: 'מקסיקו', home_flag: '🇧🇴', away_flag: '🇲🇽', match_date: '2026-06-25T22:00:00-05:00', stage: 'group', group_name: 'A', venue: 'מקסיקו סיטי' },

  // === GROUP B ===
  { match_number: 7, home_team: 'ספרד', away_team: 'מרוקו', home_flag: '🇪🇸', away_flag: '🇲🇦', match_date: '2026-06-12T16:00:00-05:00', stage: 'group', group_name: 'B', venue: 'מיאמי' },
  { match_number: 8, home_team: 'קרואטיה', away_team: 'ברזיל', home_flag: '🇭🇷', away_flag: '🇧🇷', match_date: '2026-06-12T19:00:00-05:00', stage: 'group', group_name: 'B', venue: 'ניו יורק' },
  { match_number: 9, home_team: 'ספרד', away_team: 'קרואטיה', home_flag: '🇪🇸', away_flag: '🇭🇷', match_date: '2026-06-17T16:00:00-05:00', stage: 'group', group_name: 'B', venue: 'מיאמי' },
  { match_number: 10, home_team: 'ברזיל', away_team: 'מרוקו', home_flag: '🇧🇷', away_flag: '🇲🇦', match_date: '2026-06-17T19:00:00-05:00', stage: 'group', group_name: 'B', venue: 'ניו יורק' },
  { match_number: 11, home_team: 'ספרד', away_team: 'ברזיל', home_flag: '🇪🇸', away_flag: '🇧🇷', match_date: '2026-06-25T16:00:00-05:00', stage: 'group', group_name: 'B', venue: 'מיאמי' },
  { match_number: 12, home_team: 'קרואטיה', away_team: 'מרוקו', home_flag: '🇭🇷', away_flag: '🇲🇦', match_date: '2026-06-25T16:00:00-05:00', stage: 'group', group_name: 'B', venue: 'ניו יורק' },

  // === GROUP C ===
  { match_number: 13, home_team: 'גרמניה', away_team: 'יפן', home_flag: '🇩🇪', away_flag: '🇯🇵', match_date: '2026-06-13T13:00:00-05:00', stage: 'group', group_name: 'C', venue: 'שיקגו' },
  { match_number: 14, home_team: 'ניו זילנד', away_team: 'סאודי ערב', home_flag: '🇳🇿', away_flag: '🇸🇦', match_date: '2026-06-13T16:00:00-05:00', stage: 'group', group_name: 'C', venue: 'דנבר' },
  { match_number: 15, home_team: 'גרמניה', away_team: 'ניו זילנד', home_flag: '🇩🇪', away_flag: '🇳🇿', match_date: '2026-06-17T13:00:00-05:00', stage: 'group', group_name: 'C', venue: 'שיקגו' },
  { match_number: 16, home_team: 'יפן', away_team: 'סאודי ערב', home_flag: '🇯🇵', away_flag: '🇸🇦', match_date: '2026-06-17T22:00:00-05:00', stage: 'group', group_name: 'C', venue: 'סאן פרנסיסקו' },
  { match_number: 17, home_team: 'גרמניה', away_team: 'סאודי ערב', home_flag: '🇩🇪', away_flag: '🇸🇦', match_date: '2026-06-26T16:00:00-05:00', stage: 'group', group_name: 'C', venue: 'שיקגו' },
  { match_number: 18, home_team: 'יפן', away_team: 'ניו זילנד', home_flag: '🇯🇵', away_flag: '🇳🇿', match_date: '2026-06-26T16:00:00-05:00', stage: 'group', group_name: 'C', venue: 'דנבר' },

  // === GROUP D ===
  { match_number: 19, home_team: 'פורטוגל', away_team: 'אורוגוואי', home_flag: '🇵🇹', away_flag: '🇺🇾', match_date: '2026-06-13T13:00:00-05:00', stage: 'group', group_name: 'D', venue: 'בוסטון' },
  { match_number: 20, home_team: 'ניגריה', away_team: 'אנגולה', home_flag: '🇳🇬', away_flag: '🇦🇴', match_date: '2026-06-14T13:00:00-05:00', stage: 'group', group_name: 'D', venue: 'אטלנטה' },
  { match_number: 21, home_team: 'פורטוגל', away_team: 'ניגריה', home_flag: '🇵🇹', away_flag: '🇳🇬', match_date: '2026-06-18T13:00:00-05:00', stage: 'group', group_name: 'D', venue: 'בוסטון' },
  { match_number: 22, home_team: 'אורוגוואי', away_team: 'אנגולה', home_flag: '🇺🇾', away_flag: '🇦🇴', match_date: '2026-06-18T16:00:00-05:00', stage: 'group', group_name: 'D', venue: 'אטלנטה' },
  { match_number: 23, home_team: 'פורטוגל', away_team: 'אנגולה', home_flag: '🇵🇹', away_flag: '🇦🇴', match_date: '2026-06-26T13:00:00-05:00', stage: 'group', group_name: 'D', venue: 'בוסטון' },
  { match_number: 24, home_team: 'אורוגוואי', away_team: 'ניגריה', home_flag: '🇺🇾', away_flag: '🇳🇬', match_date: '2026-06-26T13:00:00-05:00', stage: 'group', group_name: 'D', venue: 'אטלנטה' },

  // === GROUP E ===
  { match_number: 25, home_team: 'צרפת', away_team: 'ניו קלדוניה', home_flag: '🇫🇷', away_flag: '🏴', match_date: '2026-06-14T16:00:00-05:00', stage: 'group', group_name: 'E', venue: 'סיאטל' },
  { match_number: 26, home_team: 'ארגנטינה', away_team: 'שבדיה', home_flag: '🇦🇷', away_flag: '🇸🇪', match_date: '2026-06-14T19:00:00-05:00', stage: 'group', group_name: 'E', venue: 'ניו יורק' },
  { match_number: 27, home_team: 'צרפת', away_team: 'ארגנטינה', home_flag: '🇫🇷', away_flag: '🇦🇷', match_date: '2026-06-18T22:00:00-05:00', stage: 'group', group_name: 'E', venue: 'מיאמי' },
  { match_number: 28, home_team: 'שבדיה', away_team: 'ניו קלדוניה', home_flag: '🇸🇪', away_flag: '🏴', match_date: '2026-06-18T13:00:00-05:00', stage: 'group', group_name: 'E', venue: 'סיאטל' },
  { match_number: 29, home_team: 'צרפת', away_team: 'שבדיה', home_flag: '🇫🇷', away_flag: '🇸🇪', match_date: '2026-06-26T22:00:00-05:00', stage: 'group', group_name: 'E', venue: 'מיאמי' },
  { match_number: 30, home_team: 'ארגנטינה', away_team: 'ניו קלדוניה', home_flag: '🇦🇷', away_flag: '🏴', match_date: '2026-06-26T22:00:00-05:00', stage: 'group', group_name: 'E', venue: 'ניו יורק' },

  // === GROUP F ===
  { match_number: 31, home_team: 'אנגליה', away_team: 'סנגל', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away_flag: '🇸🇳', match_date: '2026-06-13T16:00:00-05:00', stage: 'group', group_name: 'F', venue: 'פילדלפיה' },
  { match_number: 32, home_team: 'הולנד', away_team: 'איבורי קוסט', home_flag: '🇳🇱', away_flag: '🇨🇮', match_date: '2026-06-14T22:00:00-05:00', stage: 'group', group_name: 'F', venue: 'לוס אנג\'לס' },
  { match_number: 33, home_team: 'אנגליה', away_team: 'הולנד', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away_flag: '🇳🇱', match_date: '2026-06-19T13:00:00-05:00', stage: 'group', group_name: 'F', venue: 'פילדלפיה' },
  { match_number: 34, home_team: 'סנגל', away_team: 'איבורי קוסט', home_flag: '🇸🇳', away_flag: '🇨🇮', match_date: '2026-06-19T16:00:00-05:00', stage: 'group', group_name: 'F', venue: 'לוס אנג\'לס' },
  { match_number: 35, home_team: 'אנגליה', away_team: 'איבורי קוסט', home_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away_flag: '🇨🇮', match_date: '2026-06-27T13:00:00-05:00', stage: 'group', group_name: 'F', venue: 'פילדלפיה' },
  { match_number: 36, home_team: 'הולנד', away_team: 'סנגל', home_flag: '🇳🇱', away_flag: '🇸🇳', match_date: '2026-06-27T13:00:00-05:00', stage: 'group', group_name: 'F', venue: 'לוס אנג\'לס' },

  // === GROUP G ===
  { match_number: 37, home_team: 'בלגיה', away_team: 'קנדה', home_flag: '🇧🇪', away_flag: '🇨🇦', match_date: '2026-06-15T13:00:00-05:00', stage: 'group', group_name: 'G', venue: 'טורונטו' },
  { match_number: 38, home_team: 'מרוקו', away_team: 'גאנה', home_flag: '🇲🇦', away_flag: '🇬🇭', match_date: '2026-06-15T16:00:00-05:00', stage: 'group', group_name: 'G', venue: 'ניו יורק' },
  { match_number: 39, home_team: 'בלגיה', away_team: 'מרוקו', home_flag: '🇧🇪', away_flag: '🇲🇦', match_date: '2026-06-19T13:00:00-05:00', stage: 'group', group_name: 'G', venue: 'ניו יורק' },
  { match_number: 40, home_team: 'קנדה', away_team: 'גאנה', home_flag: '🇨🇦', away_flag: '🇬🇭', match_date: '2026-06-20T13:00:00-05:00', stage: 'group', group_name: 'G', venue: 'טורונטו' },
  { match_number: 41, home_team: 'בלגיה', away_team: 'גאנה', home_flag: '🇧🇪', away_flag: '🇬🇭', match_date: '2026-06-27T16:00:00-05:00', stage: 'group', group_name: 'G', venue: 'ניו יורק' },
  { match_number: 42, home_team: 'קנדה', away_team: 'מרוקו', home_flag: '🇨🇦', away_flag: '🇲🇦', match_date: '2026-06-27T16:00:00-05:00', stage: 'group', group_name: 'G', venue: 'טורונטו' },

  // === GROUP H ===
  { match_number: 43, home_team: 'הונגריה', away_team: 'ג\'מייקה', home_flag: '🇭🇺', away_flag: '🇯🇲', match_date: '2026-06-15T19:00:00-05:00', stage: 'group', group_name: 'H', venue: 'אטלנטה' },
  { match_number: 44, home_team: 'סרביה', away_team: 'אוקראינה', home_flag: '🇷🇸', away_flag: '🇺🇦', match_date: '2026-06-16T13:00:00-05:00', stage: 'group', group_name: 'H', venue: 'שיקגו' },
  { match_number: 45, home_team: 'הונגריה', away_team: 'סרביה', home_flag: '🇭🇺', away_flag: '🇷🇸', match_date: '2026-06-20T16:00:00-05:00', stage: 'group', group_name: 'H', venue: 'אטלנטה' },
  { match_number: 46, home_team: 'ג\'מייקה', away_team: 'אוקראינה', home_flag: '🇯🇲', away_flag: '🇺🇦', match_date: '2026-06-20T19:00:00-05:00', stage: 'group', group_name: 'H', venue: 'שיקגו' },
  { match_number: 47, home_team: 'הונגריה', away_team: 'אוקראינה', home_flag: '🇭🇺', away_flag: '🇺🇦', match_date: '2026-06-28T13:00:00-05:00', stage: 'group', group_name: 'H', venue: 'שיקגו' },
  { match_number: 48, home_team: 'ג\'מייקה', away_team: 'סרביה', home_flag: '🇯🇲', away_flag: '🇷🇸', match_date: '2026-06-28T13:00:00-05:00', stage: 'group', group_name: 'H', venue: 'אטלנטה' },

  // === GROUP I ===
  { match_number: 49, home_team: 'קולומביה', away_team: 'יוון', home_flag: '🇨🇴', away_flag: '🇬🇷', match_date: '2026-06-16T16:00:00-05:00', stage: 'group', group_name: 'I', venue: 'מיאמי' },
  { match_number: 50, home_team: 'ונצואלה', away_team: 'אוסטרליה', home_flag: '🇻🇪', away_flag: '🇦🇺', match_date: '2026-06-16T19:00:00-05:00', stage: 'group', group_name: 'I', venue: 'דאלאס' },
  { match_number: 51, home_team: 'קולומביה', away_team: 'ונצואלה', home_flag: '🇨🇴', away_flag: '🇻🇪', match_date: '2026-06-21T16:00:00-05:00', stage: 'group', group_name: 'I', venue: 'מיאמי' },
  { match_number: 52, home_team: 'יוון', away_team: 'אוסטרליה', home_flag: '🇬🇷', away_flag: '🇦🇺', match_date: '2026-06-21T13:00:00-05:00', stage: 'group', group_name: 'I', venue: 'דאלאס' },
  { match_number: 53, home_team: 'קולומביה', away_team: 'אוסטרליה', home_flag: '🇨🇴', away_flag: '🇦🇺', match_date: '2026-06-28T16:00:00-05:00', stage: 'group', group_name: 'I', venue: 'מיאמי' },
  { match_number: 54, home_team: 'ונצואלה', away_team: 'יוון', home_flag: '🇻🇪', away_flag: '🇬🇷', match_date: '2026-06-28T16:00:00-05:00', stage: 'group', group_name: 'I', venue: 'דאלאס' },

  // === GROUP J ===
  { match_number: 55, home_team: 'איטליה', away_team: 'אלבניה', home_flag: '🇮🇹', away_flag: '🇦🇱', match_date: '2026-06-16T22:00:00-05:00', stage: 'group', group_name: 'J', venue: 'לוס אנג\'לס' },
  { match_number: 56, home_team: 'גינאה', away_team: 'שבדיה', home_flag: '🇬🇳', away_flag: '🇸🇪', match_date: '2026-06-17T13:00:00-05:00', stage: 'group', group_name: 'J', venue: 'סיאטל' },
  { match_number: 57, home_team: 'איטליה', away_team: 'גינאה', home_flag: '🇮🇹', away_flag: '🇬🇳', match_date: '2026-06-21T22:00:00-05:00', stage: 'group', group_name: 'J', venue: 'לוס אנג\'לס' },
  { match_number: 58, home_team: 'אלבניה', away_team: 'שבדיה', home_flag: '🇦🇱', away_flag: '🇸🇪', match_date: '2026-06-21T19:00:00-05:00', stage: 'group', group_name: 'J', venue: 'סיאטל' },
  { match_number: 59, home_team: 'איטליה', away_team: 'שבדיה', home_flag: '🇮🇹', away_flag: '🇸🇪', match_date: '2026-06-29T13:00:00-05:00', stage: 'group', group_name: 'J', venue: 'לוס אנג\'לס' },
  { match_number: 60, home_team: 'אלבניה', away_team: 'גינאה', home_flag: '🇦🇱', away_flag: '🇬🇳', match_date: '2026-06-29T13:00:00-05:00', stage: 'group', group_name: 'J', venue: 'סיאטל' },

  // === GROUP K ===
  { match_number: 61, home_team: 'דנמרק', away_team: 'תוניסיה', home_flag: '🇩🇰', away_flag: '🇹🇳', match_date: '2026-06-17T16:00:00-05:00', stage: 'group', group_name: 'K', venue: 'בוסטון' },
  { match_number: 62, home_team: 'מצרים', away_team: 'אל סלוודור', home_flag: '🇪🇬', away_flag: '🇸🇻', match_date: '2026-06-17T19:00:00-05:00', stage: 'group', group_name: 'K', venue: 'דנבר' },
  { match_number: 63, home_team: 'דנמרק', away_team: 'מצרים', home_flag: '🇩🇰', away_flag: '🇪🇬', match_date: '2026-06-22T16:00:00-05:00', stage: 'group', group_name: 'K', venue: 'בוסטון' },
  { match_number: 64, home_team: 'תוניסיה', away_team: 'אל סלוודור', home_flag: '🇹🇳', away_flag: '🇸🇻', match_date: '2026-06-22T13:00:00-05:00', stage: 'group', group_name: 'K', venue: 'דנבר' },
  { match_number: 65, home_team: 'דנמרק', away_team: 'אל סלוודור', home_flag: '🇩🇰', away_flag: '🇸🇻', match_date: '2026-06-29T16:00:00-05:00', stage: 'group', group_name: 'K', venue: 'בוסטון' },
  { match_number: 66, home_team: 'תוניסיה', away_team: 'מצרים', home_flag: '🇹🇳', away_flag: '🇪🇬', match_date: '2026-06-29T16:00:00-05:00', stage: 'group', group_name: 'K', venue: 'דנבר' },

  // === GROUP L ===
  { match_number: 67, home_team: 'קוריאה הדרומית', away_team: 'קוסטה ריקה', home_flag: '🇰🇷', away_flag: '🇨🇷', match_date: '2026-06-18T16:00:00-05:00', stage: 'group', group_name: 'L', venue: 'פילדלפיה' },
  { match_number: 68, home_team: 'אירלנד', away_team: 'זמביה', home_flag: '🇮🇪', away_flag: '🇿🇲', match_date: '2026-06-18T19:00:00-05:00', stage: 'group', group_name: 'L', venue: 'וונקובר' },
  { match_number: 69, home_team: 'קוריאה הדרומית', away_team: 'אירלנד', home_flag: '🇰🇷', away_flag: '🇮🇪', match_date: '2026-06-22T22:00:00-05:00', stage: 'group', group_name: 'L', venue: 'פילדלפיה' },
  { match_number: 70, home_team: 'קוסטה ריקה', away_team: 'זמביה', home_flag: '🇨🇷', away_flag: '🇿🇲', match_date: '2026-06-22T19:00:00-05:00', stage: 'group', group_name: 'L', venue: 'וונקובר' },
  { match_number: 71, home_team: 'קוריאה הדרומית', away_team: 'זמביה', home_flag: '🇰🇷', away_flag: '🇿🇲', match_date: '2026-06-29T22:00:00-05:00', stage: 'group', group_name: 'L', venue: 'פילדלפיה' },
  { match_number: 72, home_team: 'קוסטה ריקה', away_team: 'אירלנד', home_flag: '🇨🇷', away_flag: '🇮🇪', match_date: '2026-06-29T22:00:00-05:00', stage: 'group', group_name: 'L', venue: 'וונקובר' },

  // === ROUND OF 32 (placeholder) ===
  { match_number: 73, home_team: 'מקום 1A', away_team: 'מקום 2B', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-04T13:00:00-05:00', stage: 'round_of_32', venue: 'לוס אנג\'לס' },
  { match_number: 74, home_team: 'מקום 1B', away_team: 'מקום 2A', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-04T19:00:00-05:00', stage: 'round_of_32', venue: 'מיאמי' },
  { match_number: 75, home_team: 'מקום 1C', away_team: 'מקום 2D', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-05T13:00:00-05:00', stage: 'round_of_32', venue: 'ניו יורק' },
  { match_number: 76, home_team: 'מקום 1D', away_team: 'מקום 2C', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-05T19:00:00-05:00', stage: 'round_of_32', venue: 'שיקגו' },
  { match_number: 77, home_team: 'מקום 1E', away_team: 'מקום 2F', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-06T13:00:00-05:00', stage: 'round_of_32', venue: 'דאלאס' },
  { match_number: 78, home_team: 'מקום 1F', away_team: 'מקום 2E', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-06T19:00:00-05:00', stage: 'round_of_32', venue: 'סיאטל' },
  { match_number: 79, home_team: 'מקום 1G', away_team: 'מקום 2H', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-07T13:00:00-05:00', stage: 'round_of_32', venue: 'בוסטון' },
  { match_number: 80, home_team: 'מקום 1H', away_team: 'מקום 2G', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-07T19:00:00-05:00', stage: 'round_of_32', venue: 'פילדלפיה' },
  { match_number: 81, home_team: 'מקום 1I', away_team: 'מקום 2J', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-08T13:00:00-05:00', stage: 'round_of_32', venue: 'מקסיקו סיטי' },
  { match_number: 82, home_team: 'מקום 1J', away_team: 'מקום 2I', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-08T19:00:00-05:00', stage: 'round_of_32', venue: 'דנבר' },
  { match_number: 83, home_team: 'מקום 1K', away_team: 'מקום 2L', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-09T13:00:00-05:00', stage: 'round_of_32', venue: 'וונקובר' },
  { match_number: 84, home_team: 'מקום 1L', away_team: 'מקום 2K', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-09T19:00:00-05:00', stage: 'round_of_32', venue: 'אטלנטה' },
  { match_number: 85, home_team: 'מקום 3 מ-A/B/C', away_team: 'מקום 3 מ-D/E/F', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-10T13:00:00-05:00', stage: 'round_of_32', venue: 'לוס אנג\'לס' },
  { match_number: 86, home_team: 'מקום 3 מ-G/H/I', away_team: 'מקום 3 מ-J/K/L', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-10T19:00:00-05:00', stage: 'round_of_32', venue: 'ניו יורק' },
  { match_number: 87, home_team: 'מקום 3 מ-A/B/D', away_team: 'מקום 3 מ-C/E/G', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-11T13:00:00-05:00', stage: 'round_of_32', venue: 'מיאמי' },
  { match_number: 88, home_team: 'מקום 3 מ-H/J/K', away_team: 'מקום 3 מ-I/F/L', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-11T19:00:00-05:00', stage: 'round_of_32', venue: 'שיקגו' },

  // === ROUND OF 16 ===
  { match_number: 89, home_team: 'מוכשר 73', away_team: 'מוכשר 74', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-14T13:00:00-05:00', stage: 'round_of_16', venue: 'לוס אנג\'לס' },
  { match_number: 90, home_team: 'מוכשר 75', away_team: 'מוכשר 76', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-14T19:00:00-05:00', stage: 'round_of_16', venue: 'מיאמי' },
  { match_number: 91, home_team: 'מוכשר 77', away_team: 'מוכשר 78', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-15T13:00:00-05:00', stage: 'round_of_16', venue: 'ניו יורק' },
  { match_number: 92, home_team: 'מוכשר 79', away_team: 'מוכשר 80', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-15T19:00:00-05:00', stage: 'round_of_16', venue: 'שיקגו' },
  { match_number: 93, home_team: 'מוכשר 81', away_team: 'מוכשר 82', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-16T13:00:00-05:00', stage: 'round_of_16', venue: 'דאלאס' },
  { match_number: 94, home_team: 'מוכשר 83', away_team: 'מוכשר 84', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-16T19:00:00-05:00', stage: 'round_of_16', venue: 'סיאטל' },
  { match_number: 95, home_team: 'מוכשר 85', away_team: 'מוכשר 86', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-17T13:00:00-05:00', stage: 'round_of_16', venue: 'בוסטון' },
  { match_number: 96, home_team: 'מוכשר 87', away_team: 'מוכשר 88', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-17T19:00:00-05:00', stage: 'round_of_16', venue: 'פילדלפיה' },

  // === QUARTER FINALS ===
  { match_number: 97, home_team: 'מוכשר QF1', away_team: 'מוכשר QF2', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-21T13:00:00-05:00', stage: 'quarter', venue: 'לוס אנג\'לס' },
  { match_number: 98, home_team: 'מוכשר QF3', away_team: 'מוכשר QF4', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-21T19:00:00-05:00', stage: 'quarter', venue: 'ניו יורק' },
  { match_number: 99, home_team: 'מוכשר QF5', away_team: 'מוכשר QF6', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-22T13:00:00-05:00', stage: 'quarter', venue: 'מיאמי' },
  { match_number: 100, home_team: 'מוכשר QF7', away_team: 'מוכשר QF8', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-22T19:00:00-05:00', stage: 'quarter', venue: 'שיקגו' },

  // === SEMI FINALS ===
  { match_number: 101, home_team: 'מוכשר SF1', away_team: 'מוכשר SF2', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-25T19:00:00-05:00', stage: 'semi', venue: 'דאלאס' },
  { match_number: 102, home_team: 'מוכשר SF3', away_team: 'מוכשר SF4', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-26T19:00:00-05:00', stage: 'semi', venue: 'לוס אנג\'לס' },

  // === 3RD PLACE ===
  { match_number: 103, home_team: 'מפסיד SF1', away_team: 'מפסיד SF2', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-29T19:00:00-05:00', stage: 'third_place', venue: 'מיאמי' },

  // === FINAL ===
  { match_number: 104, home_team: 'מנצח SF1', away_team: 'מנצח SF2', home_flag: '🏴', away_flag: '🏴', match_date: '2026-07-19T16:00:00-05:00', stage: 'final', venue: 'מטאלייף סטדיום, ניו יורק' },
]

export const STAGE_LABELS: Record<string, string> = {
  group: 'שלב הבתים',
  round_of_32: 'שלב 32',
  round_of_16: 'שמינית גמר',
  quarter: 'רבע גמר',
  semi: 'חצי גמר',
  third_place: 'מקום שלישי',
  final: 'גמר',
}
