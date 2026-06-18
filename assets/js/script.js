const SHEET_ID = '1vF0D_WJXH5RUC7liF3fbcZCrLvre_xEGFGTD3FDYq1U';
const SHEET_GID = '0';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${SHEET_GID}`;

let JSON_SPREADSHEET = ``;

let allProducts = [];

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Seleção dinâmica do número do WhatsApp conforme dia/horário
function getWhatsappNumber() {
  // Força o cálculo baseado no fuso horário de Brasília (GMT-3)
  const now = new Date(); // Exemplo de data fixa para testes
  console.log(now)
  const brDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

  const day = brDate.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const totalMinutes = brDate.getHours() * 60 + brDate.getMinutes();
  
  const START_BUSINESS = 9 * 60;    // 09:00
  const END_BUSINESS = 18 * 60;     // 18:00
  const END_WEEKDAY = 18 * 60;      // 18:00
  const END_SATURDAY = 14 * 60;     // 14:00

  const MAIN_NUMBER = '558499284842'; // Leticia
  const SUPPORT_NUMBER = '558498035100'; // Lavinia

 let isBusinessHours = false;

  if (day >= 1 && day <= 5) {
    // Segunda a Sexta: 09:00 às 18:00
    isBusinessHours = totalMinutes >= START_BUSINESS && totalMinutes < END_WEEKDAY;
  } else if (day === 6) {
    // Sábado: 09:00 às 14:00
    isBusinessHours = totalMinutes >= START_BUSINESS && totalMinutes < END_SATURDAY;
  }
  // Domingo (day 0) cai automaticamente no suporte

  return isBusinessHours ? MAIN_NUMBER : SUPPORT_NUMBER;
}


function openWhatsapp(message) {
  const number = getWhatsappNumber();
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const whatsappButton = document.getElementById('whatsapp-header-btn');

  if (whatsappButton) {
    whatsappButton.addEventListener('click', (event) => {
      event.preventDefault();
      openWhatsapp('Olá, vim pelo site. Queria falar com o atendimento ao cliente.');
    });
  }
});

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }
  return '';
}

function getProductImagePath(nomeProduto) {
  const normalized = String(nomeProduto || '').toUpperCase().trim();
  const imageMap = {
    'IPHONE 11': 'assets/IPhones/iPhone 11/iPhone 11/ip11.png',
    'IPHONE 11 PRO': 'assets/IPhones/iPhone 11/iPhone 11 Pro/iph11pro.jpg',
    'IPHONE 11 PRO MAX': 'assets/IPhones/iPhone 11/iPhone 11 Pro Max/iph11pro.jpg',
    'IPHONE 12': 'assets/IPhones/iPhone 12/iPhone 12/image.png',
    'IPHONE 12 PRO': 'assets/IPhones/iPhone 12/iPhone 12 Pro/image.png',
    'IPHONE 12 PRO MAX': 'assets/IPhones/iPhone 12/iPhone 12 Pro Max/image.png',
    'IPHONE 13': 'assets/IPhones/iPhone 13/iPhone 13/image.png',
    'IPHONE 13 PRO': 'assets/IPhones/iPhone 13/iPhone 13 Pro/image.png',
    'IPHONE 13 PRO MAX': 'assets/IPhones/iPhone 13/iPhone 13 Pro Max/image.png',
    'IPHONE 14': 'assets/IPhones/iPhone 14/iPhone 14/image.png',
    'IPHONE 14 PLUS': 'assets/IPhones/iPhone 14/iPhone 14 Plus/image.png',
    'IPHONE 14 PRO': 'assets/IPhones/iPhone 14/iPhone 14 Pro/image.png',
    'IPHONE 14 PRO MAX': 'assets/IPhones/iPhone 14/iPhone 14 Pro Max/image.png',
    'IPHONE 15': 'assets/IPhones/iPhone 15/iPhone 15/image.png',
    'IPHONE 15 PLUS': 'assets/IPhones/iPhone 15/iPhone 15 Plus/image.png',
    'IPHONE 15 PRO': 'assets/IPhones/iPhone 15/iPhone 15 Pro/image.png',
    'IPHONE 15 PRO MAX': 'assets/IPhones/iPhone 15/iPhone 15 Pro Max/image.png',
    'IPHONE 16': 'assets/IPhones/iPhone 16/iPhone 16/image.png',
    'IPHONE 16 PRO': 'assets/IPhones/iPhone 16/iPhone 16 Pro/image.png',
    'IPHONE 16 PRO MAX': 'assets/IPhones/iPhone 16/iPhone 16 Pro Max/image.png'
  };

  return imageMap[normalized] || '';
}

/**
 * Busca o caminho da imagem em um CDN externo.
 */
function getCDNImagePath(nomeProduto) {
  const normalized = String(nomeProduto || '').toUpperCase().trim();
  const cdnMap = {
    'IPHONE 11': 'https://lh3.googleusercontent.com/rd-d/ALs6j_H_7sPS0V7s3VmRH7tdReoAXOmg61zI2OIi-iXSASH9lSbcV5lZNkH-TedQ6xTgLEP9XKaspkxrylEYlFL299ZIu0QAOel3foGSufn-y6x20Ct8mqbuzPAztHdrZGai3A1IIaOI7ECAXW4yOQi7w9Whbhc84RqPU1Ugzral3sUaiMvj5RaNqZs7jLa5kyewGur1wEMMo6392mzN8y5r2Bwv9kVfy87da-s9K7qSqh9Xygkf0Et6AMmO5BJD0Twd809xuK8nYanBVh-6O8H_t7PtRbojvxSV7xohOExYtiR0WzcAVeeDkeX1HapVBYpIGlaptUv3kOyWpobuPo_El-vET2dYUW2JmLSZBsZ8y2HUaVLpzIZRXe1q_JOwPDjODgEqRgMh3rRe3ddS4vkLOnQZF9Ft6pWtlqM37K_S0kuQpyIGclN058pjwka2-Bv96VjB8GPpS0rWLaGAd9BeIBV45jhl33-kfwiE-vPixyk1aFDH9nXp8B5Q8gxT3CD98l-gWyWMMVOjRQXetHmSUXjh-ofZ4YfX-xkQ0ydPim_J2LuCE76iKhP9pU2COQSTFNmoEnqJwtmuT_BEZESnJKAa9zE3c3_a2JUXMrnY795hfwGlji7-N-2XSXybUDep0vfrfvw-7dnx3szv7KyJgVb1R_jJVDWNJWjwlClr1jIT13Ypl2mLtH3ojWoPUDaO7JsjGo9O8j9iGNfdSVUMcmJSR9xCF8M685ORUsI7XmKEOLfeeltRmg08RhSiBNPKlqUtw2nraNrdh17Eeul0Tj7aJKUj4t2TFjXjs11TwCzlVcdtQaHI_nQsOlqzMWzNNnEx6Bb9OOS91gnOZNTxiufR7UqeTQuiqylnyq_gM0A3H6hIyB-1JXl6eTa1PDfesWIs1W5NAU_B_323D6TrqRz_5sGb_IE6rCb7O7brD73Gr9uouUdMwexDT7TtTk9YqdBCmph2j7n4POIURKc-oG5oYO0FvWFiNR5FBVCQj52ZjTM0g6FqKIudmCLoxG4C-_HcGAImxqNFeLAIP9M0DdlY4UkxlTVurXAisdLfuV7giDy84c76Q7WXPU95noBHk6ZCSFdIC06P_MJ8pzVKVkntHSvXTYFjkh5x3tROTWDsCQtmXyKP_s2NBO7-UEFhi3M=w1920-h919?auditContext=prefetch',
    'IPHONE 11 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HNk1d6DJedApqV3lWBaXZ6OoTB_0X3RweDq9mbcOZlRtaryGMCTtct6IdBTxaWFB9lOcgu9duhk5Av-rDuDvP22UP5EZKxykJcBls9fAPOQnF6EvQDZpL2YfI3Q93ngNI75M3aUklEt8SD5CYh-iJETnRXrUlF8Zt5dwITzXbYNPNm92edtaJ_aw9ozQidfkNkOwv3L0wvBG5D5tiZ6drQPEOcLEimSUadqknpj7OVjLrh62rHTZO_Mp70no9DRVoeG__Qvag3N0hyFydleStRcC2Kj6kLcngIuNyEJ9xZL5-peQ6MIr3hf1wwQ2F4GooG8QZVRfoiKZ5J09QagdBai7UhQ-EM5F6nh8FTtGuYp0POOuDDp3m7Jw9sHfVTDgxQFaojuQDJ4QFL25VDtwiVbisiwC0i3hBKmEF4bpOOygp-YEGnoyFw7LNf7NEa9T-JLVApTuU-swK8PyBBScBhGuEPB91oHnI1ANiST1u-ifz2yJziDSIwGfMzWYkWH4mNv0S3Lw7w5PfsESb250VKuqft9ZQ3epAtsjBQqITyJBTefy3XqCW6u8jISzstVI80A6gLR4N7QpkMjqQHNMVZd5WyWB8VAJd9EJwdT5d7IDaCp1WbCNpxYee5ULvcsaywAOTaOiH92YnDEtaBc7ihj0Qt3hm3InGKqzJOpf5fTvRXAIAeIgcJ2bzPOnTcV39Yzd1dadjOWpkmR9jSy1DX3lfaI8i8xuC7CjFJ59SQyCvMEHyQF4whZrfrhV6M9CDR4_MV59ZyTYLWkSP0MlD_xfxUyIaH1NBOb7BJBMw2AFGJ3btQ7-_m8hp5lfLpa_eVDspLrSX720p4KJeom3RTm3k9OvqyrqMgAT7Hot0PEnN3iGSCXBzl875lntkpfwr9zO96qITYEvbkjaYeTiUyzZX2dFjnO0C5mGePDJRVPquLSV0DX3lE_lI9npzzWH1uwW8TdaUf_0kRgTUBPgvC4woRm3TkJ6RdQYTCofBTd8olK-rvf1Dc4fy3b0ix0ws6JEVDxPs7XggweX9h5Ki0aT3Vl886jDFM-EgR1NB2gKg6dRKfP-84tJoU-UmcHBg05n5-WQEdnq3BDYGG79gAQmj5TEy5Hp42CKG7wWnJI32TmB-J2R-9Lhv-pQKZ5pw=w1920-h919?auditContext=prefetch',
    'IPHONE 11 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_GGxOs3NgYorc542rS2wBXpAE4t9q5K-kIrT1rDHl37G4d-FQehQpgNhQOaxdvvg_V02lH0svRCRzf3Z_KgXn_-ahC62wRlqvsqGNf3AHgYLW643FSVbDMDrQ9mjixyk-bTZ9PN8VqNbq0bqjjeKPiW9cqpCRI27mE_5XkVl78g5LYWjLMwOdS2YIxdWg5ERIng1gfEpF4WSpcwCw66u7WkRF_XPSs-kP_nPyHzmRFsxvb0GllT6YaP4BdXcZYSHDLoHXU_kLlkgAy8U_lGa8B_ULsAdvEEwhQ6kheHdwFp9aAHVIVeqYRpKWGG1NgBEXH47E1DfNCWvBq1ydtHOl2FQNfRxWHVJx1s0BY3dncSTwzWiC94tsPS1BsaPyYb3JgEwDthtGAkUVirjJd8vOnpwF7ns28dLD540kmPuGM_oq9AuVCrrTNRY66jsN7G57Fsed6UxvlGOIhoNftEWf_c-QMh06w3Vl-LH-gymrdvm4roavEULYLcGsp_08-9K9hz4LbPklBUw64LVqHZge-gxxyF3ywIt0LiOCYZgMUtbBNQpJncIhBLoxMoNUfD4JNFXSa3tD3LR203GbQ4QdMCMwMHhGr2Ty6r7Dw6IGqCjt7kmErSfAwbJk7iTvq-kEIMD3osaCJM7GgUxuxwKmV-2in8NLHrHQBTLB66V2E5jCElTNO4Iy8LWAv4CTtp43GMdG2VVxO5Y07QQadiGj7b__M89bESBmm1AlN8GkLkADo3ytzcUjKoPT9kG97OZXrBovsFDuzAmX_YPo_bMEPI9XDBNm7XYPp7J3HUVx5FOD-LDpMAmShPa1M0W8gEBbHOn4u5yGRotoFSdF1PjXr1pWphUlJ0Jkv_7VcojN19BxuacZunIvtFyJssr-jsOwN1_OC03UkMGS6sCQppLlJvDhuDXQXZXRup7RgLfCagBDPo_hLv-TbXwTPPdybS6XARpJO9Jrl23IWOOiPu4zX0_o8XZD1PsXNeyxmvFjsc82vDJ5LKYJRt2QxBEQZkt_tb3tzFYBRD0MdVdEl8L67aA-jyQdGZzIXezwS1xPvCQS250ITuv2U1-1K_Ol2lVRXvZRTrO6edOCLoCFPhS7BIz9UGDFLqPBDXkP3u29t9aPRGK8t6ZyE5nOJJjn50ng=w1920-h919?auditContext=prefetch',
    'IPHONE 12': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HJ2TYfxfznsiKR9x4Xgws8mXWAyJwhHm8lB_ntv6XwWQPbb-F5W-zAsOr9HZVoVdAqg4E3Hs_uqAr7-tara__YbsB9g5p4r1127PSsMmI8xz9fGrFYZI8miOgLEVgjKhYjWix3F6uGhgTbbowsGxcZVwsSKxtVS8YLSlojm2g09G1-9lruefmjLE8PUxug3EFFwEzBpM19sa5OvAyD-7SeOF337ivKUNavV9iphKpszlxHqf73eDL09wdqAOM0WUfw8xTAZxQ67AdSxi5r9zAHE_ciUKIGV52Vq0t8eBDRv7krZ29EJiDIuUwgQTOpHzexzddehv3fMx1dTddgWsP5kAkYN9v_xrQ4dBPAJOraXVG3wjK-X0iKK8d7twZ7VzRNNAB3idU5QZ7Ft7fxbK1HMqbo7PfOgqXcKJyzu3Dmgy6Dr8WQojn-dNGH7jafsAzTQO03a3ZFxJv4YSlULpD0k5zcAjpj-hyzYnPTx2IM0v8vOx1doq5E2fdug0hMlE_JXRDVrp6FDkFpJV1TYbsztLl1llwcJbQO2oRDHVazw4EY138WubwEOd_TDpan_EvA0N3VS0s0CECcsmUHC-WWcOL2uOzwbVBsi4ATP1Nru97jKIWhJQEoMaIJEbLyCxkEtFlsgm9eY4Gkob6zuRlpPN8qLI7BlIQh04wpojL2TAuKfS_yMczIM7xrkhb8Qc_nEZ76UcuULg3AUzUyoj5I5XrIbFAf_pKP8J5egKtvXtkhUnc6Ldrv_0fPFTiinAXru2ACIyQZk_dVSZaQcZ_UXLpXc3cE1Jx8ggUQ6TFevDHCcZSX7LdhJhR1zurrW729AXK-r66po4ElDIs3u1u9w8FSWn_tDW9U2n2AFYbLjDdS2KC_f-4BH905cb22MgaXRq9GwvcTbnjs-LAHO35EBNsJONEjZWdgNo_FwB-q0hWiDgzmEM2K81hbfD7pUrlOfSVy091zKDK8H3f5XXZoTDDiynSj98WJVaoaNlnaZ0nYcVoHDIxUPvWzoUKVzulm-dArJ4oDsfbAlvJFQNam0QGaBL3b7mySp9HdUylthbqg2AQ7BTAjl4KIfrPrL7YEsAHcVvJtF_hlB1_8YxdPcn5YaksSkZtRma4JDHjQ514v0aAwkRzEWigMCiQaENg=w1920-h919?auditContext=prefetch',
    'IPHONE 12 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FFIV_gRtI6t6rmHNeGOO-SnSx_6vA9DQzI9Wl1nuwRP04p9HqSmP0Q_CrVkkIMdveCw1p8_WrZKHEaVmUYxNLl3WWmZSwclSB8tg6mAbrrlg9mvBRleFIXzsZvY92zH0n4RJp86oz9iq5ZNHYBViEQmHRvt_Z0a_lS-vdIA5izMJyBbfnvHlfXazfD8yFuwjHw8ouYKU9sIaPWkk6OgmXJaj4PPYI9dIf-uukFkwj5AeuuRPu603yWu65g95x9blMNYvoBwO8BE7BwNR6F7vAbnMVnq834qoTscEBicECtZQ5KekmdOWaKxARAjJmcZ3S481yMs-lC53OneR98nEjcw5iwxC3I7LPX0UOM_eR2adilCX_1b6uppfevDJifDO1RMesT_0KHTkKtKd-vVL1TTiXv85yOaph1NOVi-XdrcpggRYPYmjAGYtOPh8VnAY0lZRdIMAJ3OEz2Nu-hutB0u5THm6n8wCSs2ZTVF4g_do9E3SPlzwIg6h8AT0sWsV6eJETTTz4Kz9nrR6t1KwLIh7VwhgjG2oxruYTXfu34Dxwld395i1vudQvMpk1EInhYenLcT6K2XC901IKLwotOtl1ILahLHAR2Kj_BhrbIIwjgB9xsM5oQ__IzhHgI_6HJXyOZKssVWDV3WGylyDsNlxHpdO7hOcsW-WaIWTz5Lk8NAl12p7wTkAfboM727BToHQtBaHPNyYMQBrCkrlMIhwBRpNRo4IEFyWryt61rqvmoSsTCSodgLVjgMXnU_QBlYMh2T9Dtk-h4dNcMTqYtJKqCz37FNNVAyA0PLDg7SC8c7DXy3veWv6KJTI-2B_KoGTilUM0WifjwFRfTB87KYJ0TobZioLuk5SUttYfHNQ38juaWyTZ0T2rdX0giVk_JHxhv-B4QmRPuCfpLqphSOx5AhB9cTFMRCFMDNMKiz_r_hqUFwrHC74Zw1LaMFeDra-TjwIRqEyS_2Jfh_qpQxC85Abj5l60cKjBEaf_JMb78XKhocAyu-kLCX3Lxtgn69WHug9c4JH8vvDl4BPx5J8vk9AFORxBXf6Ljore2fJeBJyovS-0hA1a_8R-701q0mWy6SRjvcwhLziQTjqz9ufq5JE1GJAn-cTkUx5OEfjLe3Sq54lIz3-6vus4MUQ=w1920-h919?auditContext=prefetch',
    'IPHONE 12 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FKETTsh_oFOJfLt89uqlGhTGCTNtEEcuj_ImkKBkXm6cX85_5S3XAQoDibPXDLLl0OvkAOUamjBV_7agOsqeGyezSiDC-DdWkq_2go-OYc1AT0SFCYVGMqxsS_U-q7g2vLX1Dm_seiXGosD64bKSKJHWtaHLtwWYgsY0_OwTegTfl1qSMWxsDG1oMxdQylPt_nY2J5IoicwJgqlm0KlSM3v0cwZIq7odGf0jDQCXwyAbVb6zpvtMMNUP1m4WQDidrVw_vRv6DdJ2BM8cX8lFNylah1qibjxamn5vmEwwB42cdaO_jZUMOwEvrxiiu8pmU44u0W_96ale5XIpSfvb0Dq5KqECL4aWqKF4DzLoJFn9naXYNnVJ4dJlJyvieSy6D856JE-qmiefc7oFII9CXJKhFnNCvGKyyJZpVjrzuG-leyu5wryVAd5bTSFYn4R7mcXjVcckStWmv7FKiaGuUHt1VLfeSBJOiT8K97kTt0P8rgM7jLwzcGJX-zoI_IxtXdAxo3lWKeXnQ5hAFREdbYC8pizmZPm2Si6-zuaEYC4xld4zLC7eGbJWrzHm-TOjkbH57D2iJC9rdquU4DrtBpWnKHUhMjIfLSXmBFHBuG-x-vfBvy3Z59JOy9bOZA8ExEHZvNyciLNF2pp67W7fUsKTyqiGqRISycMnHhOhaK97i0i7E-Qw6ayjk5HF1WSVS6ACLXQ9rCyDdzjsg0ijZCSDc0V8D7iEs50gaPe3BTmHSMfNxyilT1iui9qfRdU7QYLbFqpPIubQW8Mysg0RmQD_lpwW6HN2zWp9pFAt0YDMlOZzOzMECW7sIK2vEsFMfOWX-d-wMyBr3dqZOuqhg2ouBh3LL8MxFVnWdocpePlh3G80RX8gWrUCFVcgSFPtn-5EGHRBU8BPhkxoVL8VLsc2acSMX3arPGLA9C6nmEUSN5U03RdAXYgRz-UROci2cXVjhOCR-imxPlUkU231btl1BFXhrBbNkMYotMHpgLOGPKtTTVDGnEM8ElKlwHfqSQk9_Pt97iSWR7zE7ylMvA4GHix8Q0c1kElkhQ6Oyw1TazlI-2rBnVr2a0QMj18k6QUw6yF6-8GO6l2pvgOEZgHVr-1ydFGjDRq5qE56PKITM7CQ0xxHIglgUlz9URqkU=w1920-h919?auditContext=prefetch',
    'IPHONE 13': 'https://lh3.googleusercontent.com/rd-d/ALs6j_EAeurmkR_hx0j5LAG9oR7T9d24FeLLQI-aPEhI9i8Dbur_QsxGL-NMWem-l8A3XrS3c0OgUT_rOJw7YOVScF56Bg9FsNyKWpS3yvBchXa5r4vUJ9UzZ7-XQAvLupw8ksXOkVUSgtVWqE08avupoU_L3Y4gwZbh-GztbQcXFwkuDRM7ZfV_u8umYzoK1PyjVp5wupP2ePYWF8tC2VYWgp_r6DUBH47LedIvG1XxRVv1-9HUdwrSChG5MJHQ9CODA0oNs2EWu58hgoPHiHArbPCl3k1bFd_wc0EV58ubcNByJfGY4BQfQ1Ca5mSDhCKPUMzgTzFdNla74S8JV-HDTzXL_Koh-5axb64tkrEgRqB6NPwmRO3LMTdAgqXj04_4u24WnqVDLEl2AmQwhoDXM003FPdMKOT_wV4WMinvHcdCHEn5Ui2EwtZf8OXnHQQylR3gmfJKY664Z4gBQvQ6Wsdq_0Ublb8OhdSP4meoCCS3UYc5LarS3VS_i_ioJdM2MRwYesdAzuGc7N1sYy5enaNwOSiYJJspEiK9Wy0sUwWp4zasE-jjllAIw7HxFFBiwhfNXu5GIxvto6z5oDPNnx20EcA2HFZyoAb9xW3J_zoSIHVDy8L7DZ-MnKh5vfhXq468dbV8eDoU_0yrK5QBCePV_f6k4zLTiQW1MTPdkIRFJ-pU291MInABiyyUNGgjuLU6yuC3RE1j1YrDiLqKztvG23AL6XHAINJoqAS2f42PQMLfIqZcAs7dzMz04kZMuqnH9tI6dp-8MvzGYV6JGemgZAjONyKG3kgBVRiFGwt7hbCnEd_KyjEWKrm2XlhBZeK597L_UDvZvZRFhsw-XLFFCY7I8qnIjFWDPiXHFp_SmePuxR9RBPhutSC0qpYZdztheYAo8XW4JH4vA2s25_avsUpexQLa0j3Q0ZkUI6Z1QvVjuwoob5Scg5PXzlMnZc9Z8gxiltRPz5PS0h_zKXJkdWH8Y2g9FeaCWNWuOk_F3hjku03wA-AuAnvOP8O5ER7IzLX1rP2xCWcP5JTgiHkXCYmggG-uxlSDuGoL-p_3aT9bEJhpfq1XSAX0xNbBdPK5Ufkz6T2hhuCjlvfAae47TMs9BUD2LTA7kjtw8FF7-zJbg2HOX7eVQ2LASZDpLXQ=w1920-h919?auditContext=prefetch',
    'IPHONE 13 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Fxcegmk_aF5s3axVCZJRuFFLWfdmXXX65VMrTkP6EbLzYTjJUqqs5uLwiHmUmKbTOBYRHsyJJVTLfCFt9hU6AgDBQFtwRfiX3tv_qzWK51WzRg5gv2TCs-8sH2GnjLYumO_qlfa5UQMEnvIRMLyP5FC1xpRrUZ0zG_quvMpkEAaP-lSBv3DQqtzaYoTirhVbu9wxhXE9Y7sb583M4VfjHd-yne241Ri9UkkMm_w_m_p4-6dkcNxPVfBMDYO3tVcnTXXh1ntHV9PGWEgK5eK8ztJbt8H4W3kdpnKyy-wfcxWCXzg8jMRnoNR-8OLX2LOVBJQiGbVKNKXUed_3EN6ENnCx4AXSuBi84kkeckuBWbz9_8t_we0ewfKGY3rXLlOlL_IbkomhWDxyesb0JVqkJ8EaDCZ3vMaGISC49Jw_BSskHVRlwxRP7f1lr514iCL9OdBM9_HsFepAzQhZlnuXMwNmasqiKKXjOsxZUfBJ78PeDoYAo2G6AwFC9Y-0kizND0Nr1NMf2T496g5OeHfvFKVlXZynnvSpdw7Urfp1oydLq4ZCRnQiPmKlsJqShQX4xDTE6o-PcH1Rv7kc7FKXdy1FXx-VOmP8i4dzWsXkHUDOKMpKQfHlJXf_8A_N3kQ37_GHHxDPEFIv4wOI4w9Crr9_DbO2q6mjT7E1uHqwa5B1_RazraX93pUVhqNBFUzrHUBgDfh_y3ueK_AwvrAWL3xIfKThkfSdfVzaE7FdQJzSzvHixh75VcikGO1e8HuDvDIS9ilVoj7MJC4j_yr80aFBVBMoS2LaZvwp8AP1uh_HhxFgsaZGrOI8N3D3gHThK3vRVaFql9aII56BZ_9lB1tXOGIVUDYxsRhf8muj2Cm6KVjFvFC6fM7tssj9AUCJ0qhhjR0uZIHieRnuw3OiU3j2FpekEXAMExbhLIbDInlQvuQ6_lbGCIOyX0sopdTkC-Z8uuWXbrCx6tR2PTqaoDdFcN1Qp8g5xLRDFwkfuykA80FPaliMIRhPLGb4Y1Mfi1DHmCxAl_J6xthJf8TS6c6TtdzuuNVTkoXvn9VKZyWQDl7hQHmSbB65dUYwFBeNmwUiPCSj5K8PfaMZu8_ZV3eKHTBuxr71LtvXbgWBOT8xSfIGbKldV981EycomvtlI=w1920-h919?auditContext=prefetch',
    'IPHONE 13 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HrqrYX4xmTeLEfnHzj-qb3pU2VDnY_Rh7jRYqSoXtFDM7ughB_NoGsKqlUO6XvHzoecvFu8HIUINz6tY3k3WPoZMzR5Oa6FbFzPsbpA6lYku7G96a6bLgRAalA8r0ofcR7Q4ZKOylfTNj6IUdVjmJu8eBEpEiaMLT6PKfn9qIVrIawxWMzHGx0JoKhOl6rgm9beCOCBK1ukhqYQ0UKMBYo6Xc-gmii53KsIM-NdUpFs4VAhx1AVxAHdrCQ5_XtKPvFxkAh8XqQODhYNRRYRSItchlcchs_xpoiq_QYN10Ax42E-NcZwfzUqRqusl2J-XDkxshgJebHAb8VRy4NXmbD4ag9I83McTQevKWwRZeXEWyuxQQ5lmPEiuwVg3iuD3J_S684L254UsUHmM3B-u_UbTHOs1Zi95xOH8eGIPS3wj5am-dIR6Vqr9C5_hq1n1N-OxAWXZBk6gdFxU7uUPV06rryhyR_Fm9mjbs9yBKRFoZOrngAa5KkBaZ4qzhFioaTLdw0D6fwnLeDlQXdZbgHBxmDbapoLMzX5m2SnMK3NDz8b1OO2gxfEmF5mOQ3XRIameznwXjODB9vC63_hUAgW7zraURFmAKQZIK_j_bSb0OCkXunXS63rGV7eZN-NLh7Z-SfT54LTznngXZqZMzicrXFyAQBUBUXydZHhtTFweMpi5Ij4qLRpG-qOPfTRk6GJNXZFIGHPIczB6pmKDK1WwnbodiNaHmeNsNfua3Rmw5OiGLKObzAqHRq1xW5McugHrYpwNsBCs8P68yDSC6Sv6iyInML15dQShXJBeHWusktbZT3IBvtHjqH5kORvL6GIsD1uP2PO9Ea8Al0tpSUfTAyiKEqZIdSlHxptoN7AY7BWhkRC7oIatJR4GQhb4HPIKGZUMm7AwggxSVNH7YQ5vLtDvnsKN_onYno-Lh-Kyq2BmojueMnwUuztLJUGeskccox_6PxV6pVYaPiTV7yomamgUNywItIlyimgUQfzxoageh3PY79n0L9I6bfaUpiW1VLh9I-mn1aQDeuEY7Wnt5RLLdXa_MkY5_2SDWJBICKVPhdGrlna52S0PLukTQW8KB1N7yzpu2soNLshQ5KZTarwqdbWJ1BHOgLVCqn4Dwjgr-W6543Gp9A9ItDFQ=w1920-h919?auditContext=prefetch',
    'IPHONE 14': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Fo3IwGcAw1GNXcl4mZkhpA5-sNaxXM-WxdhmhhTWMNwvlykiKlNrgxhn2-WyOSXuvaQHG7ss_E1qY2WEYQ6DDtZ8s9qqIGG8dvrlvdz-pjyA0-D3hXTJn_UZ9O40uNLw0VmzYsjdYTlCnsTy6yew6SkNh3FxAPQykDuKoI8Uxgw7YusVuASTTIcc6PdpF6JYwls9yr8AnEJT4jjiz3DGOiKJ0sGaGTMSyr4enijW6AnP-IT3swcOG16qJTYLZSLgpzN6UE8U2hq-e1O5Waib1RuFWq2xQXVA7lSagLMF8UaxiHuBMWT75KBURAwypjrvqjljSIdLK3OuGS4inRwtbkXh9xYMalsUoYLGIifglpA2TaSZ6_D2GZScIr711qGKZ0q5t1_084uGmvfcPCUegZuwKxs8xw797nRXs7lVD11d_dDIletKsJeyGBNZXjP24_rbOfuNZayXX3yifvIgJq7x3dt-rJP_GUAOLBRD-xPDW89CSp_tbfB7aiz8KexQCvkJ0pXcNJfr5_YdfTRx9Tha_8SjzgesUqULh5BVJQUgc92Rc-ueoDPHBpDZw8lSZ0rOAoZ--2fm0gYzHdVu5lQ3073774-RsuFCTqI8uW9IPl3PliCEpIrbn9IFv77La9UlJecpxuly6PwVGPZxk-D5mzUv-UPx53d8G5wPVZnuo5da2Wq_4Div-DtHm2edXqn7Z5Vu93QBHlhVsVk_kv1tKBOiognhg75AWqLPzYmPYggIg3TIbP0bz3wEwCsgyW7vhnNJuctmbzwkMFnJhX342Z07RrDA_UKUYBCDoWFYbXCIgIpKgler3zLSIXq1NJYmEa6ze6ArsT3EAnMTG_6WE7qQtgKELkIR6204mvSUo077SFOBWIP4CgOW5gwe_mYlHe2eCxerDNsdBBvLCkkuUkT-F9GYsEv_wZdVl0HBww14_Bhca7lAgL-xrZIWSLYTGTzxqa8dQh8lVSJS3YVArQxvizlTCf6qjcs5wU4uhoLXrbiMeMNpwOCtCEFS3A2ESNRynNIGpthAaZFv4eGiPc6jqThHY-oxYGNGe9_srgxaW33zSzXFH82Q1l4egJ7kKKgmKRzSIRji-aE1c-TMpBzthBYj3yA1WxOZJXn99VwFnnbFeS3uzKH18YXvY=w1920-h919?auditContext=prefetch',
    'IPHONE 14 PLUS': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HTudcUCUXzr7y9JrPV9DZC8vlGIC8sulfZUszktDwvXZQtT-sNNSp6Dni1kgRcTtshl-8PS_0dRHZMdDkH7erxI_HCgf6K0jlym93KXTW3eTD250nUmqrwbvTwniGERddVisFb3fDFJG519YrDyJ6DgVvPcoh-zEoH49fxrRXXrtBYWpHYAGoowaCAxr69h440OaPSZk_aiZIkV3Fe9Jk99q_kq7RQ8mTeTCvoCtrYyaiNdPtElEbYY-PiFpM3S12OaTCV-mipxspvWvnC0_q6RdTTTgl10Vu9AeeLcOo5P-cUeYga1fP-t6I95Mbvu-HAYIs_dd6PD0GUye46nEnHUI9AZcAiu3yms1VJd1nHej9j_zW_WFmOuITNYCF3afL4N1GLlQKyWRP30IjrxuKXakuIYJWiNjcrtpA13blALupv2X5OardgEjwl-QpW_S5BpeV5jXFLD0lmh5VftTrFsrytSmzZqis3OsOn_5y1_uOYLNSmMb-Mcix2t3X_bMjkJt_ierUbPCc8qFgUaiRSEobMUBdx4BYLDbxKYL9AZy2214Hi73oMectbggZzm5MtCZipcBkf2oYZ1SQC3eLdgYwwsuoRpu8J-_vwsYABd8HJN8AkhUR3VklJwCn3J6KNuf5j9SeRh2W7pcApPktibi-3hHcfAKWvlZmn10rWatVUOyKCMk7T1PrBhsZmQNSRdhDUOehoslEBWDYnnms1BRldeOj-in5KeeJgmsOjLS0fhSQxS_Uft3tudsecfWdf-22-JJp2hESxuXFTyHNisK6U9rOtxB98ibJRaMLNfea_9tIefOoaOlGLWnX0RQ6lhpuX3r5ed3eJp1aCUWnh9Sqs62czSvzxcAQ3SRGbHRygkRm_3yE6P7XwK5IDSlfsFectKEbwaPfhoxvNmyo_UhzOveJuE3qU4gYtqFlSlwAlS40bfTVmqci3JZZEBxx4Km2SF_RSR-SgOJWoxbBIDmV2fRg1vVFJTUtDUKmpsBaGcxhsn-_Xbl5DzkSv021MBmJPXAc3OET2wcNYvw8xBdIz9lBc6BoKErqeV2QuMh8am5ENp3sCndn02oIZdxeL2guXEBFBlZ8WWMhzyxeIQLhB1-crhJMqF29fiLLu2f1KTHpYeqL53gbWtQew15I=w1920-h919?auditContext=prefetch',
    'IPHONE 14 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HvcZkbc77wHXGx9kHKWYnlC6iv4ZZzVQGAB3TFH1irUf9kIqdbzK6468TAEeAi4x-zgx4acktgEPYkt5zA9T0vtq82vLHz8uZR3i3Gw6YtXpLG5C7eFBGa0o6wiIBYDw_6uOUkEU4kW5L8ufa3Q0AbXwJE0W6O6hbogwpYMLq82gd90EvqlGspf9ReGwwrsI7AjG-aDfS6X0yeI0j1liCVa11qyzQoik2mnjsFgCsdC04PN2zuWl-lVF131oH0RL2qyMIi_ZXJLVHJV0mFOHYhu3LbJEb2GwaoPHAeRLR-Kkco4FdtkDXOnq1p3XGnFei1grdINwM2ebk-E-V8KR5bW5je-oXZspwVScmVrR3vPynhRQB6RrlNCkmt-vV5NtZ5P0gvdJ0e_oQUY8jvCIHp8h2be6tydNWcq0iSEtUvbYI1cp5xc4nmtIc1VskVu3ic9PqVQ8SHbEQPaiP7YXaY8rzvDkUePuYAJmvV_v5Gy4uNYEhrKjA8D14w1d-OE_t2bf7JU5_QMb_P5yvq6AfpX4rbQopOhm-PGyBY_CpBfRUEgc-nOhyNU4qmkxdFyfpzOw1kG-CDCayKNhlpKkTfuCHLCvJHJeC9QkKf-oe09D4dsJMHanEUiRN_9ve51PJVfotOPTUnsGq2Owy_16UuX2lwjfO48v6YMZHGa9C8lJoP5u0MbdGDQufUILzClp2GV1j5N4cBBUXCQBk0sb8XU7WOR4WLzJpHJISnJmRuaZZg_jim1KlNUeulc6VXsfb1V8p0LnoolMrhacT1aEZKBcx9NSohB2d9Q8GlVyGOKZlPReMry6sN10y9rmE-9lQFdZThtZpzMPfLlQ1q7CGJbY8b_EOcPsOYvfKI6QK8rHYBXRy8oYze3F-96UAmZ1U6eQRLB6XrVWqstGZ_H_ufLxC8EvgTOzII3s7-ck6n7xPvNSoDOTbmi9g13GCJeJ3OFQVU_CFUQp1UiHBZhLy7yuLm58Ek94nxDmY9xTOGYY-41GZ8Fcr2Q8c3kb4vac-bK2ZaXeCZiSx9OyeUK6HhvQ9JoSi4F9UWUybwsHazr4jI_NRUXUbZV4JzhqYI0iAlfldf2nSDSyYGi0MNPXVW2nWJvoCIPD3-PlC74yY7qNsJKItcAgaYBYdV7InKww=w664-h599?auditContext=prefetch',
    'IPHONE 14 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_F8YHWwEff-vPVOPzPhuTHUR3IOnuhpzXsJm_VKdHPwZ5VEb-PTctN-5r4pI08af9sRfOSEDGxWqS1BMGJllePoMth0b5zaBgp3sU0xH-eZSbqP1zrqXEPERjTHaAHhQR0RNy9s6PvFv40g1T91h_HgW7gyigCUSnuI0P3_7NHG_81v3OekCqrTLH-THn7ZHVXMqYFdH0BGrWpsnssSVGszxS_dqCxEhQagnZZ3f9BxoAT1Bt2RWaaPTm3aXccoZ08NuTkl22vlFlm8XrPqfvm-ZiGpyLa0hrJEt_jBbVXYGqu4Om9doFhx9K6td3rP7fbI--Lvz7LQX3AfEgqO6J3FvLBSdwPZfDffyqaR5N7obX7jKa3p_U3rFAFBv7z5xX7SHfTJTz72AKYpvl2pZjIW--FG_xNNIxOpzzs1Xo0St9xsPlz9AHQdfN5dIf7REK0ikWwS-0EpHx8ELGx5CsjX1iqw5eBQVy4OHsyZUqC7OVhw9xIMAiVMQqbZnHaZusVNnWlSJSPyTu-ceky4rZePjPDyxIj4Xl07Ks6hmICHkskmyBDBDn8hl1lISLPTOzWYoa72l1e8fNBgDeOnbAu0GQU2aRFH0DX4OeXP2hOHBFUa6RI1stxPCF27ooIMWdmcZNQbwthtsEAjRzVSeEATvmsWavyAvGdhIXZy4NH5lvfBUSD1q7-XvjtIkGXwSl8lV8O895z53sNoZdt5AxMMkQMsF5EjQUEMl3Fkmj-we23lGzUp6s-MG7bkfkWZylzCDTt0S1VKJZP6Q1NyicJVMjnmUQo-i0hWq6wwK1NK80Rjs5OYYzVcIYNx1qOXyruXS3aMPDFgUFoeInAMczJG1RXQubKWG1eJvxEp94Ei3-vlahG7pGNO2fATR_RS9KlvUIXXf_2DDOz_u2S5SEeS6xUzxt_cyGXBYeqEFvSECO7I1MIn6uuxF-_JlpKYUd5Hjj7emfh6-jOr94y3CPCOUbxL5NJIkj_7EC5eWIuNGYy7yIGcGTShUK05ASAC9l0LlUMUdwrklsow57pFCFuuj3Dlx-DagkebXJRkXYC5wS3JBzYDa7TCCVEust5-no2kOu8bMfIYCJZyo_dXego_sj-JoSXmr2zHD7W3DE-4gNHIewbj9PBGtB5tYH6vcoE=w1125-h599?auditContext=prefetch',
    'IPHONE 15': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FqEc5JyIXw7QpQFSAspOJQsAq8_Q9RHBkGsnRqg6rjTFvu5EGeOdb-SBVGzumXhOWXF-HLbAdp-e8ngiGlas0k0jjYGEDdm2il45FOPq8AQyCxCmekiIfDqPQIqtvHfJ3wkBQkxfXp1I8o9LVyMqOJzvZKj29VUwiyhOuDhtaMFP_yMBXfdqB42zu58zHfOKXFopl0Kj4HcUYLm5rOPr86Iqqs2SmSuvwk9cfZ5pDd1ngeVamGk9UPMaG6QJ8Wjjb_TfZWolC7W531uMYLTQSeeHYWVmsNMsg5S1k-um-moJqQqgKQ19u6ItM18OYwX1H2G4RaDXOXnGLgPlpAvFKHLkzpsmjktm23sGQu62plvgSZ1Yf-QpfXi6htN_l3UrD_6Dgwmk4COJJ7atc9o0DjQGbqRrP2BcCzpOEUidioFIrS9IRBBQJWy1xXE5vpKa21hlzTc67iSmTEaoVn3E1Swha1me-qVNEDgt2PsZRTitAIoo3MUOGj1zx1v9Z4nQDqvW33E5w4oywaf-_KQ48kVXnPt2yRjd3TWR0OgMjn0Rr9ANfaWrQ-f9L9OE-62L3MdN8jKwq65YvPK3TiulrfxNEQYPbPFZvxzyWyGiSJiq9eObZ9ZBCMWSnNXokJETrcJUYYmWFrFVvbdOGhjEak2vIxfKMU7_eu_0qydu_2vIT9AHdD0PPPCvj51oXhYTW-uWzNdtZmwCf9aTN4D-_0jUMKTwx5Pw-RKVZwcO075sIDVdDxnRCKYdSjHGaGtTQInK---DdLIo6JiV6gZJ0p-_V7Gj-AMSNyRFCx6bmDM8CbXhaF5O57LHvKuu-tr758jnXZBVVgCVpFLljwe6uzuluRUsE-oUAzVqanEW9ahWwZwFJej4D_vKzdzmtdl10m3tBhxCw_THvwt9OYzCg3Xm2xzoVRBaGn_1yi7EASm7nRAsZK0Wn8xssbrAbKm6tZAuxYS4qCoGc6sTWqFMgTOVZ0jsW0tOmt4ykjfV3dsKLqwPDofLRDP3liQq490wfFpylqYZ6tA0FKAeRA7vYspbeGT1s3pu_1chsI7Jllsr3iyCd79xO1wbS_Olqc6WRQMMlTtzYowf1RdgFFKcEP4HYDGpvgdVtaZooNP62_zLbOj0u2X1gOdmalvt99_vc=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PLUS': 'https://lh3.googleusercontent.com/rd-d/ALs6j_FLcL-CXDDkIOG3aa4sdFhU94wbd-LlrO0D_kV-JqQni6mg8SSy_ET21EHTQvgquMjeWW5D3DLNsw-T-RanSekfHnP8Krbm4iBrI3EOsBnoYvT_C9AM8HYx8v7HHHnliSoe0J28ds_7yfUA_Zm9i-Y8PRRpuYq1LFCOHYXt2rN5sN7oA0VxOM9vViXuI3BqxlTHiuJ6gVOAXqStdeicEOitv3WjLIHjBQF3IoEWplrSmgTGsMfo_L9-pFrRDVELj9vCKDcP_1AV3WrAl3uPHUsrgVvJuyqYlvijcGTPocuRxahrNGTbnBkv4WWCnEf5iUtRNuYVZtF-533lLYzHoaCu-ZjROZGaulJLoVOlfnKl_fWKVNmsvZev7L7damrPSEIC6n6ZW5wl5u9nKgaNx953iwa1VtQa30rtOMcnFHiHlFVI3zM9ZVgDUOBkdmM644k0VductQyQmuJy1wTtqM4x6Smj5Fc_27tfyHOG8AKA8o1nhwbBXwiNyHXYaTzvnb4b0aiG4DXkTYYr0SyD5I14nhgerj2XtVi8m4w4Q7hOoG8CnibDKDUNBM7yLNiNkA-K9o-3yORiMcSFHRcELxOaycTKd9hDumpzF81jjou0_fOtC371MCm-zbtv794l3nqCiOTGAxz5QJ3eVQ4oGvsBC0zyL1STyZZw-LzqnND-6I-jZ3HJat81g4t96rTtc0HBChTWjjtY6RfcWg63EHfMkY4WzV3uDh7rTtxNTO98bm-ooEdAxgamp6BpR0a6vXUERvvSGJ_VJZaJ6Ugsd4jOj3yfrlggj6Bn1H3aMVjZciCi85ELvuVDINrkHp8QoSfxLK-Ei72R7VCHvx64saXmdiH0tGo341wXIRPE3J3UCSBRw5rjZk1-vDE5_LBRrNl8rFpaNM_SuZ02sPdDG5NQ2qB6IDYXw0DFfEgkZk8c2mZmmi5pGVAj0A9KndKNL8XjANeGdy_ahr8zuZCkaD_NolSkNowpmq4FtweTiq4lclsFWrplTPzAD19G79iaDIRY4tbT_f-XKYeIHpIcTL8Svl2dUrqXLQBQ27yKowOfOi3mXQbZ0XhZdbfIVI0LWk62DbgezHL5dMVjuhJxUre4yHfOYvS8ojzqeO-jrdH-HhG6-hx05Qobja38fGqJKRk=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HDzl8EvO-0XEbB146sF3K0w1Lty3sW2dBEQHH9_n4ARf0Ri-sss9Iw1IZ3khRPwLZ6uy2M-mOCONd8GE_r6_vOFXZjDp18bPLE6ZREQl0BH1cdCuqTUV70pRIf2ut-cmJsmWrIiFza2URjs-oLuSMyiGru5YeyCiqlnmtzwlgJqwn75IzTmObJpY6AbeUnWgqAgFoNiETB23FuMuhQPCMLgTnOiCqccnpCLsAP-hADthreE_pULnNrTuobgZg8sstVpUIjsWPNm3SBiJHhPxlO4SkcI4ccGp55cP5QwIP8tUcOO26OOTwx1CACyNbbw2nu005Nzg3qbv4T0qv9qzQO3qbXmL6QIigNypjBljxOJN85BAjvEDK6icg3Fo_ZS7UcGmCRE5Tp0FTKffQy-Q3FqRmKz-sa1_vqXcpEcLENEa_TNPjYAVrPRxydzyG6srYv7-fmafpuIj67JZjcy6UPaTTZrajTusuo13cAX708K0TaTxks440UWzqaIDvNyGQir9TinYWadVwYaVBwbwJx9EHjtklGWNfcDzItY9aEcvrEUrgxY2c7iMDtXONWauDeNKIFMqCRITEbAwCCwAlo7VAFgHNOxF48OUV9kP_cPTPPeohTcmjbO1vQszE_Fm9FZ2FpXuYjS_W6t4xFXj4JPXLsmh9BEbnXHjb__jOwDI3aMJ_BW7CYnPx3AEZJ2bYtUPnXACz1MoTTqTJ2Ds6GMXFY1tSxv8w2X5YJDOQb2LcWLpl8L5qUbUtqzD_SFdGyDdUhc9yFLaspWPgcJxpUwCMtof-n4mwsmhFrTOxztOzSc8wbWP6_odbUp__9ASJUTkkn0tOOfCijQzwj4yjCWzfSYi2ou2EBpO5q5XDol3ISvLM4SK-RmtvR2hMjbgxxJoVHjRNHTsbpGDJIRLaaj_MhTSZJvjies2Ek1kHaIEQ4saZwcr9XKYhkswi1tEAKSu_vgi1OWbLp_V8qIpkqpyc-IYGo9T4FJdvIJa7XkQpruR5Ud1Q6zKpqWs-dBzaMzPVP1FiOZN17OxpNy6f_AR2yioCRHrSoUlPrDZj_tqkTP8Nh52ur4t5w8C-zgc1Ts8nvSZ2apfUbuvzKsY0mVYGncLiXH0IU0FCXB5ImgQw6fXsJvkLCcEXT2Vru1Xc=w1125-h599?auditContext=prefetch',
    'IPHONE 15 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HLXA6FN7SF_2zwi7FkIBwHpHFzxJtU25nMmZsuBqlpO0NbEXWVbWtNf9UssUru9CoK7lSos8YPW1tBBfBXLRVeOyEKv674wAyRS-_aXnZDqn26-4crv_9XNCSCB206kYV6DNyJr_PhP3mYgcvS4ovn9PbWhrc1_mDcKQValD-8qHX02oN3pBvgRfgcBEsqsvCGrDo9vGlhzIIHO8dINKLqfvFLpwre8akDzqxkzuGHjcivKy1dGGPJwH3mx0z22uY9JqDXDjWY7uruaQ6Uj7Y1_Hgw-0xABcP2nV8mPCNn4pKxdKHIpuTi8kq1pYpanTfooMAS5yU_o_2n_zY-YjWBGBkhqgZLI1yloZ47YRKvc1VwDI_vccWXUhIbTUWT3em97uf-SS2JYrVukUWL1QbZ8TV3vOevGjUqULKX_Ozq4YMl-dVCEPqGvdrbaoQgi3o3sbwCQhJiFDEPx6wKVjsnqiKIgxaOuup0VQmNBzSV07BzM0LGDbs6AJ1cUrC3UCv8imjUovXc5tzYHQom3g4TMg8FKm9rlj3rAjaQEUefgNoDB_QmXVyyTuf9DijxqgAZy73ZFPw17IqqOfHtyqc6DT-3qng1lrPX7dltIDx4ZSTfltNgOY5UAt493n0-gIi7HytaVSV8-eBCrH7kkQ5nw4btYPjHHNi0DLNlpSaa4JzcEddRxCQZBYIO4-jQy73gD8i9w2dNTi8elNVbjKGjD0zQEtXpyhSGTG4vtg4N-4lv9X_8GTHp7a2kX74mCB46t4d_OG19Y9_Fm0wv5VY6C1CNlMyW76IxkXSpedVhALVxzcA-yWAoyjU-fHO3N8WLqWV586JyTu12aDjyg1hHbvHtbpHzO-EiC6144BzUxqPbusf5E6OIse3ESBQI1EivyUz_9gICs6k2kshOYnv2s17m2JQBm8CyYp9RPS4tpZZTQNqy2b2a_BT_xUo87AsXLp8s-F0nVyBf6ZS_J_YesFn-AQ1g6qhZTJx832Bi5P__KctKyQd3ECelkcO62w8Fp94BdQ2EkgphcliDV6G5ujyi7L2jxSAk0r8IJOm9Az26wwmimCWJRoc3SIbVg10m-rTMCJvje4ajbOI1H08IxvL4eD-SYzFSLHcInsLlZrwmfB25w9vMXONUgplaLaA=w1125-h599?auditContext=prefetch',
    'IPHONE 16': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Hsmw0H8ChFaZklx_3KDSvrwyt6hH_3gDStpSwcn8OiTyseK2wwHGc-cuTtFav2Mh3PbG4qbpmrig3yDs-ybY1BozZs76K2MBdE4h_flzh4VtNoDXfInm5SEBLxAbDQEsq-72o0BlyMHeXr6oTMYswB3kezqCpKoWaNSv_T6oDze0Awb6sc5VKDi-tCvoyXZl1OrjpX0f0XtAsVTeXYKkhNhYwJWLmwdJOaJduVQK5-khnOi_CiH7exnKGuT80bA53E7iHq3_aiG658u-gVblW0RBg63nL3tYe9dlkfOceifpcaq8geCyYTL1B4RxiUWMRXUwxmhr8wEBx5NOhtEhFHoN7pQhy-U8S7aEJvsUYWnEnmJTsZ5kjHooZVEuQv0fVRQfpcJIBqxitWmouSRplOkhOPTbUL6Tkp-ICxTMMVxKOjtACXKyZNaC0vdKbRmOkG3WHxyH4949Bl5O398NEPb-1dRU9tykOhFqbI6L5E_D0j6_YEUs8qbxyLMpR6k3BiVtZh-X3ocshNqQDF_5ZEsC3PREYZS-grAOwwtw3quXjYMToXiLHIMfgsULdEK_fct2EjZ8KCBN5lNqtX4YSdN0UQYAFpV3rAElL85UmVhUPSFRh-nTFFKv7NHOLogat6eLyJouDVVo2jfwPEbZK218zfkfBnSG8a085mZGWLCh7lemvNa3irxkoXlMXJtrntxuoxJ3iCFQv9sFAWfJ1ED_XdN9fH1YX2odTbXV2Gw0hLGC3D35pSsB0xTRCc7v2NesYKrJ-ogNqmuXIYUU3h-ulScLoJqBfrUOquOLOpIM3g3GOqANLTEUvsGfTUSk6V8soR5W0Ak6u8Wwclmx2MpU9BmbU_thUP4SRor1VRXbx_0yJoW_tZ2EJPPBqq7DSp5Sv6nIwGpEy4MNn_6AzuDxKD6MRmWFocXIf-yRHtkzu34GxmKa4l3tLN4_DFdSm3vhV_rkFMtUh3kwoFwjG5JdoK6RhLgKwwscJb4pvxnNlZqa_9gqZTcyaqu0AC-9k41bPA_mCKSPKSpitqthrcWiS5gAEjJDHh3ADBtX4nDv7E_r6aifpiVRFz-v6_zcN6A8g_GA1mbf_4jq9lyPmIU-t-nB3gSEz1aFNVf6Ptasw20fS-D8Lked_-wmX14g=w1125-h599?auditContext=prefetch',
    'IPHONE 16 PRO': 'https://lh3.googleusercontent.com/rd-d/ALs6j_Grr1trIUadw7qolgx3HWoks-ITjMSsHI68QxDkNJqe7qa5YH57l6U-hb05NEhWKNEnUums745JFVsNY70UjVMSHT6CDkbbcejbVzw8hivXI3-Wn799MRxSpDU1C-JrbhlMb3UGH6eNi3cKCZmlw6UA0vLTVWazFDKKQWGQyIpzMv8lyk22XNqRVu0-bN-IRte5jxouRUuEcJSdboMTw2_Ke9KK7bfQ2J6VKa1hroT-mFYNdnpOcrcEdhlZLldQiUHroRUvoNQJ3CdX_kOd0tf5gLmOGPIU8VNnYSi6cZmrlSNI1KlqXqFRobEbR3A4WA4MiqpEb-jZbmv8wRqiibTArflrJGhUp9Q6lSiYJjRT-RU5Ij2SiYNp8s2eypM9MRS5QGEus4rDLbpr3ebv9BeghIXCaqL3Hjg_YR8lZAUq_nt5a5XoObrv8xZAJnGqGMKZuuoZ4-EsQH9RihVfg4VH5h374FTOzAq6kYRRKs9FodMAtm4G3vbr_ZT-0vgnGjI_i2pAy5EKvMRSxDRRTytcPlpDIh2PCreY3hLpWDgjy_Ga15eGfxPAoVFSidh3QXOcbFlNGQZWmOT3RY9m-MJ-b6QvhP4MsbLIhVq_qKq-o6qa2JADCMoqn1IHwPAjFiE8mdl0jChIXNtb35kHdtiJPWS0RFCzeo9TSQninEpMeAUi-t42050ccZ_USMO0ua8auaZWAzKYuxj-nMTS-GUifz0MPrZI_d1jqXZwnxCojiXkzz_tW77hQppklmMLCASA5RXavndp7gVLWePlOHfoKU3zOnM8QwPAX6kwoDOT6Mb-dKJS2O8MHtuaFyQZFdr_dKNc0pU6SzSvCRha6xP5_2007l_QDaIvJG5Wyde5dUjM6wnSrpE7nY142_ois6BFtaARVANQ_N2JNYVs_A4CY2Hmapti6FE8jVtq1w4OoKpD1vfmn7pacVHVd-7ZIi1SrlWOGaxigrOJ2JKqgs6Wa2u-n3DR1KChuxZXEJfS6FPExEwWQczU_b2UgoWE0414wocjhNx8pw2IKS5m5SlSTu-7j41mPtHK2zNXayF01eV4J_wdkwMFuO-VrNAPomcP9Gt6Kd5k3mY4Ipx7scbnZuFLJi2ow-VXlMDj0VrnH5qYKGduQzqM2oKmT2-rZA=w1125-h599?auditContext=prefetch',
    'IPHONE 16 PRO MAX': 'https://lh3.googleusercontent.com/rd-d/ALs6j_HYo3rqIaTEKULFZeXpunErcdo1eCbjAJ7mPRL68WRLUmX46vP-BjIOj348bRlqecS0hcLeOsHGSKzZWjxD9GsJo0SDs8D9IyZTQMYITwb_QRazWj42HiyK1E4Is-m2Vmc_sK7YTp26pQOJrgJiXjlX7CKlzsVLZoaMas2Sw_Ftr-zqte4o5Vy1v0POkO5S3GQDnQMhqqDT6y2uPHQNEEWa0XcBdmaAqh1jB3uxHBd79xqEEOcA9LMm0ZbJ1hhW8KxepVhCVTzIB0ApK7c3WwA52N8EVMVFc9f6sTbOgRWO-Vu9Ma46WShpW7d0-rA4BWdmqeaside6It6-dz66pv3XmYPx1niqGaIjF4ParFoY6P812qYS24vpp6bOEXRrjG3u9GkxK8_VySvB9Hz6ClYpdzcHM4he-Cqfs8dW39BsZcNAGBoNockNzvSR57aHH-eF4dRYz483SPtwLHzFbqBv3sOUTsHv-gu6mntW5LJY1nkPoJ6b9aRzogL-EGrbj1l6PJJBO8_-0-N0P5wA3T0lswde-oKKcE3qFV-mUOf4OnPgSi3tBBKWu1cJteG3gUQbxC_fre7mOQ_4_aHTMCdoLDjn_dNlTvKC3FCH_HGLYjSX8Rs852K4Qp7Vs7XS1pRkP-KlxvBaO9H2LZEFEJ8PlPpjfwq7c0zFkMsCXHjTfkpei50efKLjjgPUa2pLsjrgBkbi3tP9L_heMJOfrilyGaHjI_p3MmoVN-scrCwIm5edQChLHO8rMMfJfdu1tuACs9SF2v_fjt84jDueNWLz43VYXhueYmeR8Fs60e58P7YciCkO-v2_e0CSwZj0HzabxyTVpnyGTwGzw6wxujX3F-BkUNvx6iqlc3rU4exFznMviiwLXdAN_nVKx4ZEMQ-RQRPIe_noSjCnHnwWQjCKFQpN4Cycr1239qlCq4hnTMwxvIg-N2x09J5o3Q1fZ8EDk_a7fBfaVyF5OKqtQR1SSzdw2mjnM7PEKOfZ8xpD7L95KR502ZEkyUtLQ5wscST6ieseeCsVcZTdCRMHGJpC-_RlpJNNeDBLeJNU4wVhQMYx-zYdubDmUEbfo3xR5VcTtSdBNBWWrQbZDlzRm1ZCACTpviQo3BWzv_EBDCL9RsJ0KnLMuH2SUzlJ1WA3-Fw=w1125-h599?auditContext=prefetch'
  };


     

  return cdnMap[normalized] || null;
}

/**
 * Resolve qual imagem usar como fallback (CDN > Local).
 */
function resolveFallbackImage(nomeProduto) {
  return getCDNImagePath(nomeProduto) || getProductImagePath(nomeProduto);
}

function parseGvizResponse(gvizText) {
  if (!gvizText) return [];

  const rawText = typeof gvizText === 'string' ? gvizText.trim() : '';

  const parseTable = (table) => {
    if (!table?.cols || !Array.isArray(table.rows)) return [];

    const rows = Array.isArray(table.rows) ? table.rows : [];
    const fallbackHeaders = table.cols.map((col, index) => {
      const label = (col.label || '').trim();
      const columnName = label || (col.id || `col${index + 1}`).trim();
      return columnName;
    });

    let headers = fallbackHeaders;
    let dataRows = rows;

    if (rows.length > 0) {
      const firstRowValues = (rows[0]?.c || []).map((cell, index) => {
        const value = cell?.f !== undefined && cell?.f !== null
          ? cell.f
          : (cell?.v !== undefined ? cell.v : '');
        const normalizedValue = typeof value === 'string' ? value.trim() : '';
        return normalizedValue || fallbackHeaders[index] || `col${index + 1}`;
      });

      const looksLikeHeaders = firstRowValues.some((value) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value));

      if (looksLikeHeaders) {
        headers = firstRowValues;
        dataRows = rows.slice(1);
      }
    }

    return dataRows.map((row) => {
      const cells = row?.c || [];
      const product = {};

      headers.forEach((header, index) => {
        const cell = cells[index] || {};
        const value = cell.f !== undefined && cell.f !== null
          ? cell.f
          : (cell.v !== undefined ? cell.v : '');
        product[header] = value ?? '';
      });

      return product;
    }).filter((product) => Object.values(product).some((value) => String(value).trim()));
  };

  if (rawText.startsWith('{') || rawText.startsWith('[')) {
    try {
      const parsed = JSON.parse(rawText);
      if (parsed?.table) return parseTable(parsed.table);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.warn('Não foi possível interpretar o JSON diretamente.', error);
    }
  }

  const startToken = 'google.visualization.Query.setResponse(';
  const start = rawText.indexOf(startToken);

  if (start === -1) {
    return [];
  }

  const jsonText = rawText.substring(start + startToken.length, rawText.lastIndexOf(');'));
  const response = JSON.parse(jsonText);
  return parseTable(response?.table);
}

function normalizeProducts(data) {
  const normalizedProducts = data
    .map((product) => {
      const rawDescription = product.descricao || product.obs || product.observacao || product.description || product.descricaoProduto || '';
      const fallbackDescription = rawDescription || (product[Object.keys(product).find((key) => key === 'descricao')] || '');

      const name = firstNonEmpty(
        product.aparelhoDescricao,
        product.nome_produto,
        product.nomeProduto,
        product.name,
        product.titulo,
        product[Object.keys(product).find((key) => key === 'IPHONE 14')],
        product[Object.keys(product).find((key) => /^IPHONE|SAMSUNG|XIAOMI/i.test(key))],
        product[Object.keys(product).find((key) => key === 'A' && product[key])]
      );

      const description = firstNonEmpty(
        product.descricao,
        product.descricaoProduto,
        product.observacao,
        product.description,
        fallbackDescription
      );

      const price = Number(
        firstNonEmpty(
          product.valorVenda,
          product.valorVenda2,
          product.valorVenda3,
          product.valorCusto,
          product.preco,
          product.price,
          product.K,
          product['K'],
          product['5622'],
          product['0']
        )
      ) || 0;

      const state = firstNonEmpty(
        product.estadoProdutoDescricao,
        product.estado,
        product.estadoProduto,
        product.status,
        product['SEMI NOVO'],
        product['N'],
        product['AM'],
        product['AN']
      );

      const storage = firstNonEmpty(
        product.gbDescricao,
        product.memoria,
        product.armazenamento,
        product.storage,
        product['128gb'],
        product['Z'],
        product['AA']
      );

      const category = firstNonEmpty(
        product.tipoProdutoDescricao,
        product.categoria,
        product.tipo,
        product.category,
        product['CELULAR'],
        product['Y']
      );

      const resolvedName = name || (product["aparelhoDescricao"] ? product["aparelhoDescricao"] : 'Sem nome');
      const fallbackImage = resolveFallbackImage(resolvedName);
      const image = firstNonEmpty(
        product.fotoUrl,
        product.foto,
        product.imagem,
        product.image,
        fallbackImage
      );

      const imei = firstNonEmpty(
        product.imei,
        product.IMEI,
        product.imeiNumero,
        product.numeroImei,
        product['IMEI']
      );

      const hasBlockedKeyword = /(display|bateria)/i.test(String(product.aparelhoDescricao || ''));
      //console.log(product)
      
      return {
        id: firstNonEmpty(product.id, product.codigo, product.sku, product.idProduto),
        name: resolvedName || 'Sem nome',
        description: description || `${state || 'Produto'} • ${storage || 'Sem informação'}`,
        price,
        state: state || 'Sem estado',
        storage: storage || 'Sem informação',
        category: category || 'Sem categoria',
        imei: imei || 'Não informado',
        image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shouldHide: hasBlockedKeyword,
        distinctKey: `${String(firstNonEmpty(product.aparelhoDescricao, resolvedName)).trim().toLowerCase()}::${String(state).trim().toLowerCase()}`
      };
    })
    .filter((product) => product.name && product.name !== 'Sem nome' && !product.shouldHide);

  const seenProducts = new Set();

  const uniqueProducts = normalizedProducts.filter((product) => {
    if (!product.distinctKey || seenProducts.has(product.distinctKey)) {
      return false;
    }

    seenProducts.add(product.distinctKey);
    return true;
  });

  return uniqueProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');

  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <h5 class="text-muted">Nenhum produto encontrado.</h5>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card product-card shadow-sm h-100">
        <img src="${product.image}" class="product-image object-fit-contain" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h5 class="card-title mb-0">${product.name}</h5>
          </div>
          <div class="product-meta mb-3">
            <div>Armazenamento: ${product.state}</div>
            <div>Armazenamento: ${product.storage}</div>
            <div>IMEI: ${product.imei || 'Não informado'}</div>
          </div>
          <div class="mt-auto">
              <button class="btn btn-buy w-100" data-product-name="${product.name}" data-product-state="${product.state}" data-product-imei="${product.imei || ''}">
              <i class="bi bi-whatsapp me-2"></i>Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-buy').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-product-name') || 'produto';
      const state = button.getAttribute('data-product-state') || 'não informado';
      const imei = button.getAttribute('data-product-imei') || 'não informado';
      const message = `Olá, vim pelo site. Quero mais detalhes sobre o aparelho: ${name}, imei: ${imei}, estado: ${state}`;
      openWhatsapp(message);
    });
  });
}

function populateFilters(products) {
  const filter = document.getElementById('category-filter');
  if (!filter) return;

  const states = [...new Set(products.map(product => product.state))].sort();
  filter.innerHTML = '<option value="">Estado aparelho</option>';

  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    filter.appendChild(option);
  });
}

function filterProducts() {
  const searchInput = document.getElementById('search-input');
  const filter = document.getElementById('category-filter');

  if (!searchInput || !filter) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const stateFilter = filter.value;

  const filtered = allProducts.filter(product => {
    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
    const matchesState = !stateFilter || product.state === stateFilter;
    return matchesSearch && matchesState;
  });

  renderProducts(filtered);
}

window.askForXiaomi = function () {
  openWhatsapp('Eu vim pelo site e quero mais detalhes sobre um Xiaomi.');
};

function debounce(fn, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

async function init() {
  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error(`Falha ao carregar a planilha (${response.status}).`);
    }

    const text = await response.text();
    const data = parseGvizResponse(text);

    allProducts = normalizeProducts(data);

    populateFilters(allProducts);
    renderProducts(allProducts);

    const searchInput = document.getElementById('search-input');
    const filter = document.getElementById('category-filter');

    if (searchInput) {
      searchInput.addEventListener('input', debounce(filterProducts, 300));
    }

    if (filter) {
      filter.addEventListener('change', filterProducts);
    }
  } catch (error) {
    console.error('Erro ao carregar os produtos.', error);
    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-danger">
          Erro ao carregar os produtos. Verifique se a planilha está pública.
        </div>
      `;
    }
  }
}

window.addEventListener('DOMContentLoaded', init);
