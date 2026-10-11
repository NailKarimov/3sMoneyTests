# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y/axe-wcag.spec.ts >> Доступность (axe-core, WCAG 2.1 A/AA) >> страница /pricing: нет критичных нарушений доступности
- Location: tests/a11y/axe-wcag.spec.ts:12:9

# Error details

```
Error: Серьёзные нарушения a11y:
[serious] color-contrast: Elements must meet minimum color contrast ratio thresholds (узлов: 1)
  пример: <u>view our fees plan</u>
[critical] label: Form elements must have labels (узлов: 3)
  пример: <input class="input--input" type="number" placeholder="" value="">
[serious] link-name: Links must have discernible text (узлов: 7)
  пример: <a class="Link_link__s0GAk Link_dark__9L0c6" href="/">
[serious] listitem: <li> elements must be contained in a <ul> or <ol> (узлов: 15)
  пример: <li class="BulletPointItem_customListItem__5xRjy" style="margin-top:12px">

expect(received).toEqual(expected) // deep equality

- Expected  -    1
+ Received  + 1039

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#dfe8e6",
+               "contrastRatio": 3.84,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#327e75",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.84 (foreground color: #327e75, background color: #dfe8e6, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"PricingPlanCard_pricingPlanCard__Vp8_h bg-color-neutral-400\">",
+                 "target": Array [
+                   ".bg-color-neutral-400",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.84 (foreground color: #327e75, background color: #dfe8e6, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<u>view our fees plan</u>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-400 > div:nth-child(3) > .mt-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > h6 > a[href$=\"fees-and-pricing\"][linktype=\"story\"][target=\"_self\"] > sub > span > u",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+   Object {
+     "description": "Ensure every form element has a label",
+     "help": "Form elements must have labels",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/label?application=playwright",
+     "id": "label",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "emptyAttr",
+             },
+             "id": "non-empty-placeholder",
+             "impact": "critical",
+             "message": "Element has an empty placeholder attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element has an empty placeholder attribute
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<input class=\"input--input\" type=\"number\" placeholder=\"\" value=\"\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           "input[type=\"number\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-placeholder",
+             "impact": "critical",
+             "message": "Element has no placeholder attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element has no placeholder attribute
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<input type=\"checkbox\" name=\"\" class=\"iconDark\" value=\"\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".checkbox--wrapper:nth-child(2) > .checkbox--container.square.green > .iconDark[name=\"\"][value=\"\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-placeholder",
+             "impact": "critical",
+             "message": "Element has no placeholder attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element has no placeholder attribute
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<input type=\"checkbox\" name=\"\" class=\"iconDark\" value=\"\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".checkbox--wrapper:nth-child(3) > .checkbox--container.square.green > .iconDark[name=\"\"][value=\"\"]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.forms",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.n",
+       "TTv5",
+       "TT5.c",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.1.1",
+     ],
+   },
+   Object {
+     "description": "Ensure links have discernible text",
+     "help": "Links must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/link-name?application=playwright",
+     "id": "link-name",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"Link_link__s0GAk Link_dark__9L0c6\" href=\"/\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           "#navigation\\ \\(new\\) > .NavigationDesktop_navigation__lyJaP.NavigationDesktop_isVisible__bF5B4 > .NavigationDesktop_navigationContent__ZI10v > .Container-module_content-alignment-center__JL8gX.Container-module_size-page__7D5vM.container-theme-light > .Container-module_size-page__7D5vM.Container-module_containerContent__KBWou > .NavigationDesktop_mainContent__AxfXs > .NavigationDesktop_logoCentered__GODay.NavigationDesktop_logoRevealed__TpcYX > .Link_dark__9L0c6.Link_link__s0GAk[href=\"/\"]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"IconSocial_iconSocial__24IMa IconSocial_linkedin__KClz_ IconSocial_light__cnGTE\" target=\"_blank\" href=\"https://www.linkedin.com/company/3s-money\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".IconSocial_linkedin__KClz_",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"IconSocial_iconSocial__24IMa IconSocial_instagram__kpUCu IconSocial_light__cnGTE\" target=\"_blank\" href=\"https://www.instagram.com/3s.money\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".IconSocial_instagram__kpUCu",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"IconSocial_iconSocial__24IMa IconSocial_facebook__mffsM IconSocial_light__cnGTE\" target=\"_blank\" href=\"https://www.facebook.com/3smoney\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".IconSocial_facebook__mffsM",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a class=\"IconSocial_iconSocial__24IMa IconSocial_whatsapp__VCMHD IconSocial_light__cnGTE\" target=\"_blank\" href=\"https://wa.me/message/WEXUHASUANWKE1\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".IconSocial_whatsapp__VCMHD",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a target=\"_blank\" class=\"Link_link__s0GAk Link_dark__9L0c6\" href=\"https://apps.apple.com/us/app/3s-money/id6452016748?itsct=apps_box_badge&itscg=30200\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".Link_dark__9L0c6.Link_link__s0GAk[target=\"_blank\"]:nth-child(1)",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "has-visible-text",
+             "impact": "serious",
+             "message": "Element does not have text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "serious",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "serious",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "serious",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix all of the following:
+   Element is in tab order and does not have accessible text
+
+ Fix any of the following:
+   Element does not have text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute",
+         "html": "<a target=\"_blank\" class=\"Link_link__s0GAk Link_dark__9L0c6\" href=\"https://play.google.com/store/apps/details?id=com.mobile3smoney.app&pcampaignid=web_share&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1\">",
+         "impact": "serious",
+         "none": Array [
+           Object {
+             "data": null,
+             "id": "focusable-no-name",
+             "impact": "serious",
+             "message": "Element is in tab order and does not have accessible text",
+             "relatedNodes": Array [],
+           },
+         ],
+         "target": Array [
+           ".Box-module_gap-0-2__5vjgp.Box-module_direction-row__qrAeK.Box-module_box__ky3dN > .Link_dark__9L0c6.Link_link__s0GAk[target=\"_blank\"]:nth-child(2)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag244",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.2.4.4",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-6.2.1",
+     ],
+   },
+   Object {
+     "description": "Ensure <li> elements are used semantically",
+     "help": "<li> elements must be contained in a <ul> or <ol>",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/listitem?application=playwright",
+     "id": "listitem",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-50.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(1) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-50.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(2) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-50.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(3) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-50.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(4) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-neutral-50.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(5) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-green-700.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(1) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-green-700.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(2) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-green-700.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(3) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-green-700.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(4) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-green-700.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(5) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-black-alpha-20.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(1) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-black-alpha-20.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(2) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-black-alpha-20.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(3) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-black-alpha-20.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(4) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "listitem",
+             "impact": "serious",
+             "message": "List item does not have a <ul>, <ol> parent element",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   List item does not have a <ul>, <ol> parent element",
+         "html": "<li class=\"BulletPointItem_customListItem__5xRjy\" style=\"margin-top:12px\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-color-black-alpha-20.px-2.pt-2:nth-child(2) > .foldable > div > .pb-3.Box-module_direction-column__r6q16.Box-module_box__ky3dN > .RichText_richText__Y2t2h.body-1 > div:nth-child(5) > .BulletPointItem_customListItem__5xRjy",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.structure",
+       "wcag2a",
+       "wcag131",
+       "EN-301-549",
+       "EN-9.1.3.1",
+       "RGAAv4",
+       "RGAA-9.3.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e4]:
    - generic [ref=e9]:
      - generic [ref=e11]:
        - paragraph [ref=e14]: Solutions
        - paragraph [ref=e22]: Clients
        - paragraph [ref=e30]: Pricing
        - paragraph [ref=e38]: Resources
        - paragraph [ref=e46]: Company
      - link [ref=e53] [cursor=pointer]:
        - /url: /
      - generic [ref=e56]:
        - link "Contact" [ref=e57] [cursor=pointer]:
          - /url: /contact-us
        - paragraph [ref=e72] [cursor=pointer]: ENG
        - link [ref=e73] [cursor=pointer]:
          - /url: https://clientportal.3s.money/signin
          - button "oval-loading Log in" [ref=e74]:
            - status "oval-loading" [ref=e76]
            - generic [ref=e82]: Log in
        - link [ref=e84] [cursor=pointer]:
          - /url: https://welcome.3s.money/express
          - button "oval-loading Check eligibility" [ref=e85]:
            - status "oval-loading" [ref=e87]
            - generic [ref=e93]: Check eligibility
    - generic [ref=e98]:
      - separator [ref=e99]
      - heading "Plans that scale with your business" [level=1] [ref=e100]
      - separator [ref=e101]
      - paragraph [ref=e104]: Choose a Global or UAE (DIFC) business account and select the plan that fits your business needs, tailored to your preferences.
      - separator [ref=e105]
      - generic [ref=e106]:
        - generic [ref=e108]:
          - generic [ref=e109] [cursor=pointer]:
            - img "image" [ref=e112]
            - paragraph [ref=e113]: Global
          - generic [ref=e114] [cursor=pointer]:
            - img "image" [ref=e117]
            - paragraph [ref=e118]: UAE (DIFC)
        - generic [ref=e119]:
          - paragraph [ref=e121]:
            - generic [ref=e122]: What is the difference?
          - generic [ref=e124] [cursor=pointer]
        - generic [ref=e133]:
          - separator [ref=e134]
          - generic [ref=e138]:
            - generic [ref=e139]:
              - generic [ref=e140]:
                - generic [ref=e142]:
                  - paragraph [ref=e143]: Standard
                  - generic [ref=e145] [cursor=pointer]
                - separator [ref=e153]
                - generic [ref=e154]:
                  - paragraph [ref=e155]: €100
                  - paragraph [ref=e156]: / monthly
                - separator [ref=e157]
                - generic [ref=e158]:
                  - separator [ref=e159]
                  - generic [ref=e161]:
                    - paragraph [ref=e168]: Local GB, LU, FR and NL IBANS
                    - paragraph [ref=e175]: Access to SWIFT, SEPA and Faster Payments networks
                    - paragraph [ref=e182]: Multi-level and two-factor authentication
                    - paragraph [ref=e189]: Accounting integrations i.e Xero and Kyriba
                    - paragraph [ref=e196]: A dedicated Relationship Manager
                    - paragraph [ref=e203]: Up to 2 account users
              - generic [ref=e204]:
                - generic [ref=e205]:
                  - paragraph [ref=e209] [cursor=pointer]: Suitable for...
                  - paragraph [ref=e219]: UK and EU-based businesses with up to 5 beneficiary owners and monthly transaction volumes below €100K.
                - generic [ref=e220]:
                  - paragraph [ref=e224] [cursor=pointer]: Fees of popular transactions*
                  - generic [ref=e233]:
                    - generic [ref=e234]:
                      - listitem [ref=e236]:
                        - paragraph [ref=e242]: UK Faster Pay • £1
                      - listitem [ref=e244]:
                        - paragraph [ref=e250]: EUR SEPA • €2
                      - listitem [ref=e252]:
                        - paragraph [ref=e258]: Payments to UAE • 0.30%
                      - listitem [ref=e260]:
                        - paragraph [ref=e266]: Payments to China • 0.60%
                      - listitem [ref=e268]:
                        - paragraph [ref=e274]: Receive from EU, UK, US and UAE • 0%
                    - button "oval-loading Go to transaction fee calculator" [ref=e275] [cursor=pointer]:
                      - status "oval-loading" [ref=e277]
                      - generic [ref=e283]: Go to transaction fee calculator
              - generic [ref=e285]:
                - link [ref=e288] [cursor=pointer]:
                  - /url: https://welcome.3s.money/express
                  - button "oval-loading Check eligibility" [ref=e289]:
                    - status "oval-loading" [ref=e291]
                    - generic [ref=e297]: Check eligibility
                - heading "*Based on selected plan a fixed cost could be applicable, please view our fees plan for more information" [level=6] [ref=e301]:
                  - subscript [ref=e302]: "*Based on selected plan a fixed cost could be applicable, please"
                  - link "view our fees plan" [ref=e303] [cursor=pointer]:
                    - /url: /fees-and-pricing
                    - subscript [ref=e304]:
                      - generic [ref=e305]: view our fees plan
                  - subscript [ref=e306]
                  - subscript [ref=e308]: for more information
            - generic [ref=e309]:
              - generic [ref=e310]:
                - generic [ref=e311]:
                  - generic [ref=e312]:
                    - paragraph [ref=e313]: Enterprise
                    - generic [ref=e315] [cursor=pointer]
                  - generic:
                    - generic:
                      - paragraph: Popular
                - separator [ref=e323]
                - generic [ref=e324]:
                  - paragraph [ref=e325]: €300
                  - paragraph [ref=e326]: / monthly
                - separator [ref=e327]
                - generic [ref=e328]:
                  - separator [ref=e329]
                  - generic [ref=e331]:
                    - paragraph [ref=e338]: All Standard features
                    - paragraph [ref=e341]: plus
                    - generic [ref=e343]:
                      - generic:
                        - generic:
                          - paragraph: Save up to 50% on transaction fees
                    - paragraph [ref=e350]: Complex business structures accepted
                    - paragraph [ref=e357]: Custom API integrations
                    - paragraph [ref=e364]: Negotiable transaction fees
                    - paragraph [ref=e371]: Up to 5 account users
              - generic [ref=e372]:
                - generic [ref=e373]:
                  - paragraph [ref=e377] [cursor=pointer]: Suitable for...
                  - paragraph [ref=e387]: importers/exporters, wholesalers, real-estate managers, and businesses with global monthly transaction volumes below €10M.
                - generic [ref=e388]:
                  - paragraph [ref=e392] [cursor=pointer]: Fees of popular transactions*
                  - generic [ref=e401]:
                    - generic [ref=e402]:
                      - listitem [ref=e404]:
                        - paragraph [ref=e410]: UK Faster Pay • £1
                      - listitem [ref=e412]:
                        - paragraph [ref=e418]: EUR SEPA • €1
                      - listitem [ref=e420]:
                        - paragraph [ref=e426]: Payments to UAE • 0.15%
                      - listitem [ref=e428]:
                        - paragraph [ref=e434]: Payments to China • 0.45%
                      - listitem [ref=e436]:
                        - paragraph [ref=e442]: Receive from EU, UK, US and UAE • 0%
                    - button "oval-loading Go to transaction fee calculator" [ref=e443] [cursor=pointer]:
                      - status "oval-loading" [ref=e445]
                      - generic [ref=e451]: Go to transaction fee calculator
              - generic [ref=e453]:
                - link [ref=e456] [cursor=pointer]:
                  - /url: https://welcome.3s.money/express
                  - button "oval-loading Check eligibility" [ref=e457]:
                    - status "oval-loading" [ref=e459]
                    - generic [ref=e465]: Check eligibility
                - heading "*Based on selected plan a fixed cost could be applicable, please view our fees plan for more information" [level=6] [ref=e469]:
                  - subscript [ref=e470]: "*Based on selected plan a fixed cost could be applicable, please"
                  - link "view our fees plan" [ref=e471] [cursor=pointer]:
                    - /url: /fees-and-pricing
                    - subscript [ref=e472]:
                      - generic [ref=e473]: view our fees plan
                  - subscript [ref=e474]
                  - subscript [ref=e476]: for more information
            - generic [ref=e477]:
              - generic [ref=e478]:
                - generic [ref=e480]:
                  - paragraph [ref=e481]: Enterprise Plus
                  - generic [ref=e483] [cursor=pointer]
                - separator [ref=e491]
                - generic [ref=e492]:
                  - paragraph [ref=e493]: Bespoke
                  - paragraph [ref=e494]: / monthly
                - separator [ref=e495]
                - generic [ref=e496]:
                  - separator [ref=e497]
                  - generic [ref=e499]:
                    - paragraph [ref=e506]: All Enterprise features
                    - paragraph [ref=e509]: plus
                    - generic [ref=e511]:
                      - generic:
                        - generic:
                          - paragraph: Save up to 70% on transaction fees
                    - paragraph [ref=e518]: Highly complex business structures accepted
                    - paragraph [ref=e525]: Specialised payment solutions
                    - paragraph [ref=e532]: Reduced FX rates on hard currency pairs
                    - paragraph [ref=e539]: Up to 10 account users
                    - paragraph [ref=e541]
              - generic [ref=e542]:
                - generic [ref=e543]:
                  - paragraph [ref=e547] [cursor=pointer]: Suitable for...
                  - paragraph [ref=e557]: holding companies, asset managers, financial institutions, private aviation and businesses with monthly transactions above €10M.
                - generic [ref=e558]:
                  - paragraph [ref=e562] [cursor=pointer]: Fees of popular transactions*
                  - generic [ref=e571]:
                    - generic [ref=e572]:
                      - listitem [ref=e574]:
                        - paragraph [ref=e580]: UK Faster Pay • £1
                      - listitem [ref=e582]:
                        - paragraph [ref=e588]: EUR SEPA • €1
                      - listitem [ref=e590]:
                        - paragraph [ref=e596]: Payments to UAE • 0.10%
                      - listitem [ref=e598]:
                        - paragraph [ref=e604]: Payments to China • 0.25%
                      - listitem [ref=e606]:
                        - paragraph [ref=e612]: Receive from EU, UK, US and UAE • 0%
                    - button "oval-loading Go to transaction fee calculator" [ref=e613] [cursor=pointer]:
                      - status "oval-loading" [ref=e615]
                      - generic [ref=e621]: Go to transaction fee calculator
              - generic [ref=e623]:
                - link [ref=e626] [cursor=pointer]:
                  - /url: https://3s.money/contact-us
                  - button "oval-loading Get in touch" [ref=e627]:
                    - status "oval-loading" [ref=e629]
                    - generic [ref=e635]: Get in touch
                - heading "*Based on selected plan a fixed cost could be applicable, please view our fees plan for more information" [level=6] [ref=e639]:
                  - subscript [ref=e640]: "*Based on selected plan a fixed cost could be applicable, please"
                  - link "view our fees plan" [ref=e641] [cursor=pointer]:
                    - /url: /fees-and-pricing
                    - subscript [ref=e642]:
                      - generic [ref=e643]: view our fees plan
                  - subscript [ref=e644]
                  - subscript [ref=e646]: for more information
          - separator [ref=e647]
          - generic [ref=e650]:
            - generic [ref=e651]:
              - paragraph [ref=e652]: 100% transparent
              - paragraph [ref=e653]: transaction fees
              - separator [ref=e654]
              - paragraph [ref=e655]: Tired of hidden fees? Calculate how much you'll pay to send and receive international business payments.
            - generic [ref=e656]:
              - generic [ref=e658]:
                - paragraph [ref=e660] [cursor=pointer]: Send money
                - paragraph [ref=e662] [cursor=pointer]: Receive money
              - generic [ref=e663]:
                - generic [ref=e664] [cursor=pointer]:
                  - generic [ref=e665]: Choose your desired account type
                  - link "Select" [ref=e669]:
                    - /url: "#"
                - generic [ref=e677] [cursor=pointer]:
                  - generic [ref=e678]: Sending to
                  - link "United Kingdom" [ref=e682]:
                    - /url: "#"
                    - paragraph [ref=e685]: United Kingdom
                - generic [ref=e692]:
                  - generic [ref=e693] [cursor=pointer]:
                    - generic [ref=e694]: Choose a currency
                    - link "GBP (£)" [ref=e698]:
                      - /url: "#"
                  - generic [ref=e705]:
                    - generic [ref=e706]: Amount to send
                    - spinbutton [ref=e709]
              - button "oval-loading Show me the fee" [ref=e711] [cursor=pointer]:
                - status "oval-loading" [ref=e713]
                - generic [ref=e719]: Show me the fee
              - paragraph [ref=e722]: Please note that additional charges may apply when you send or receive payments in non-local currency to that of the sender/recipient bank, and the use of specific currencies is subject to eligibility.
          - separator [ref=e723]
          - table [ref=e726]:
            - rowgroup [ref=e727]:
              - row [ref=e728]:
                - columnheader [ref=e729]:
                  - paragraph [ref=e730]: Compare pricing plans
                - columnheader [ref=e731]:
                  - paragraph [ref=e732]: Standard
                - columnheader [ref=e733]:
                  - paragraph [ref=e734]: Enterprise
                - columnheader [ref=e735]:
                  - paragraph [ref=e736]: Plus
            - rowgroup [ref=e737]:
              - row [ref=e738]:
                - cell "(Billed monthly)" [ref=e739]:
                  - paragraph [ref=e741]:
                    - generic [ref=e742]: (Billed monthly)
                - cell [ref=e743]:
                  - paragraph [ref=e746]: €100
                - cell [ref=e747]:
                  - paragraph [ref=e750]: €300
                - cell [ref=e751]:
                  - paragraph [ref=e754]: Bespoke
              - row [ref=e755]:
                - cell "Features" [ref=e756]:
                  - paragraph [ref=e758]:
                    - generic [ref=e759]: Features
                - cell [ref=e761]
                - cell [ref=e762]
                - cell [ref=e763]
              - row [ref=e764]:
                - cell "Account Manager" [ref=e765]:
                  - paragraph [ref=e767]:
                    - generic [ref=e768]: Account Manager
                - cell [ref=e769]
                - cell [ref=e773]
                - cell [ref=e777]
              - row [ref=e781]:
                - cell "Software Integration" [ref=e782]:
                  - paragraph [ref=e784]:
                    - generic [ref=e785]: Software Integration
                - cell [ref=e786]
                - cell [ref=e790]
                - cell [ref=e794]
              - row [ref=e798]:
                - cell "Access-levels" [ref=e799]:
                  - paragraph [ref=e801]:
                    - generic [ref=e802]: Access-levels
                - cell [ref=e803]
                - cell [ref=e807]
                - cell [ref=e811]
              - row [ref=e815]:
                - cell "Batch payments" [ref=e816]:
                  - paragraph [ref=e818]:
                    - generic [ref=e819]: Batch payments
                - cell [ref=e820]
                - cell [ref=e824]
                - cell [ref=e828]
              - row [ref=e832]:
                - cell "API Solutions" [ref=e833]:
                  - paragraph [ref=e835]:
                    - generic [ref=e836]: API Solutions
                - cell [ref=e837]
                - cell [ref=e841]
                - cell [ref=e845]
              - row [ref=e849]:
                - cell "Account users" [ref=e850]:
                  - paragraph [ref=e852]:
                    - generic [ref=e853]: Account users
                - cell [ref=e854]:
                  - paragraph [ref=e857]: "2"
                - cell [ref=e858]:
                  - paragraph [ref=e861]: "5"
                - cell [ref=e862]:
                  - paragraph [ref=e865]: 10+
          - separator [ref=e866]
          - paragraph [ref=e867]: More on our fees and pricing
          - separator [ref=e868]
          - generic [ref=e871]:
            - paragraph [ref=e872]:
              - text: For more details about the fees we charge, please see our
              - link "Fees and Pricing" [ref=e873] [cursor=pointer]:
                - /url: /fees-and-pricing
              - text: and
              - link "Terms and Conditions" [ref=e875] [cursor=pointer]:
                - /url: /terms
              - link "." [ref=e877] [cursor=pointer]:
                - /url: /terms
            - paragraph [ref=e878]:
              - text: The pricing is applicable from February 17th, 2025. If you are on another package, check our
              - link "legacy fees" [ref=e879] [cursor=pointer]:
                - /url: /fees-and-pricing/archive/february-2025
              - text: .
            - paragraph [ref=e881]:
              - text: Please note that eligibility for a pricing package may depend on the nature of your business. If you’re a business with a high payment volume or have specific requirements,
              - link "get in touch" [ref=e882] [cursor=pointer]:
                - /url: /contact-us
              - text: to discuss a custom pricing package to suit your needs.
          - separator [ref=e884]
          - generic [ref=e885]:
            - img "image" [ref=e888]
            - generic [ref=e889]:
              - paragraph [ref=e890]: "\"3S Money is more cost-efficient than our ‘traditional’ bank options.\""
              - paragraph [ref=e891]: Marina Gehring - Finance Director, EVI Europe
              - paragraph [ref=e892]: EVI can now send and receive payments from their suppliers and customers around the world. Plus, their dedicated Relationship Manager is on hand to offer tailored support as and when they need it.
              - separator [ref=e893]
              - link [ref=e897] [cursor=pointer]:
                - /url: /customer-stories/evi-europe
                - button "oval-loading Read full story" [ref=e898]:
                  - status "oval-loading" [ref=e900]
                  - generic [ref=e906]: Read full story
            - generic [ref=e908]:
              - generic [ref=e909]:
                - paragraph [ref=e910]: Need more information?
                - paragraph [ref=e911]: Get in touch
              - separator [ref=e912]
              - paragraph [ref=e913]: Our team will guide you through the process of opening your business account - no need to step into a bank. Let us know if you want to schedule a call in your native language.
              - separator [ref=e914]
              - generic [ref=e915]:
                - link [ref=e916] [cursor=pointer]:
                  - /url: https://welcome.3s.money/express
                  - button "oval-loading Open an account" [ref=e917]:
                    - status "oval-loading" [ref=e919]
                    - generic [ref=e925]: Open an account
                - link [ref=e927] [cursor=pointer]:
                  - /url: /contact-us
                  - button "oval-loading Contact us" [ref=e928]:
                    - status "oval-loading" [ref=e930]
                    - generic [ref=e936]: Contact us
            - img "image" [ref=e940]
        - generic [ref=e942]:
          - separator [ref=e943]
          - paragraph [ref=e944]: More ways to
          - paragraph [ref=e945]: get in touch
          - separator [ref=e946]
          - paragraph [ref=e947]: Reach out to us today - we'd love to help you achieve your business goals
          - separator [ref=e948]
          - generic [ref=e949]:
            - link [ref=e950] [cursor=pointer]:
              - /url: /contact-us
              - generic [ref=e952]:
                - generic [ref=e954]:
                  - img "image" [ref=e958]
                  - img "image" [ref=e962]
                - paragraph [ref=e963]: Submit a request
                - paragraph [ref=e964]: Need assistance? Tell us a bit more about your needs, our team will get in touch.
            - link [ref=e968] [cursor=pointer]:
              - /url: https://wa.me/message/WEXUHASUANWKE1
              - generic [ref=e970]:
                - generic [ref=e972]:
                  - img "image" [ref=e976]
                  - img "image" [ref=e980]
                - paragraph [ref=e981]: Chat with us on Whatsapp
                - paragraph [ref=e982]: Connect with us for real-time support during business hours (Monday - Friday, 9am - 5:30 GMT)
            - link [ref=e986] [cursor=pointer]:
              - /url: /contact-us
              - generic [ref=e988]:
                - generic [ref=e990]:
                  - img "image" [ref=e994]
                  - img "image" [ref=e998]
                - paragraph [ref=e999]: Contact your local office
                - paragraph [ref=e1000]: For personalised assistance, reach out to your local office in the UK, Netherlands, Luxembourg, France, Dubai, Latvia and Hong Kong.
          - separator [ref=e1004]
    - generic [ref=e1007]:
      - generic [ref=e1008]:
        - generic [ref=e1009]:
          - paragraph [ref=e1010]: Solutions
          - generic [ref=e1012]:
            - link [ref=e1013] [cursor=pointer]:
              - /url: /solutions/global-accounts
              - paragraph [ref=e1014]: Global accounts
            - link [ref=e1015] [cursor=pointer]:
              - /url: /solutions/payments-platform
              - paragraph [ref=e1016]: Global payments
            - link [ref=e1017] [cursor=pointer]:
              - /url: /business-currency-exchange
              - paragraph [ref=e1018]: Currency wallets & FX
            - link [ref=e1019] [cursor=pointer]:
              - /url: /solutions/expert-support
              - paragraph [ref=e1020]: Expert tailored support
            - link [ref=e1021] [cursor=pointer]:
              - /url: /debit-card
              - paragraph [ref=e1022]: Business debit cards
        - generic [ref=e1023]:
          - paragraph [ref=e1024]: Top industries
          - generic [ref=e1026]:
            - link [ref=e1027] [cursor=pointer]:
              - /url: /industries/asset-managers
              - paragraph [ref=e1028]: Asset managers
            - link [ref=e1029] [cursor=pointer]:
              - /url: /industries/consultancies
              - paragraph [ref=e1030]: Consultancies
            - link [ref=e1031] [cursor=pointer]:
              - /url: /industries/digital-asset-businesses
              - paragraph [ref=e1032]: Digital-asset businesses
            - link [ref=e1033] [cursor=pointer]:
              - /url: /industries/e-commerce
              - paragraph [ref=e1034]: E-commerce
            - link [ref=e1035] [cursor=pointer]:
              - /url: /industries/education
              - paragraph [ref=e1036]: Education
            - link [ref=e1037] [cursor=pointer]:
              - /url: /industries/holding-companies
              - paragraph [ref=e1038]: Holding companies
            - link [ref=e1039] [cursor=pointer]:
              - /url: /industries/it-services
              - paragraph [ref=e1040]: IT services
            - link [ref=e1041] [cursor=pointer]:
              - /url: /industries/real-estate
              - paragraph [ref=e1042]: Real estate
            - link [ref=e1043] [cursor=pointer]:
              - /url: /industries/shipping-and-logistics
              - paragraph [ref=e1044]: Shipping and logistics
            - link [ref=e1045] [cursor=pointer]:
              - /url: /industries/sports
              - paragraph [ref=e1046]: Sports
            - link [ref=e1047] [cursor=pointer]:
              - /url: /industries/travel
              - paragraph [ref=e1048]: Travel
            - link [ref=e1049] [cursor=pointer]:
              - /url: /industries/wholesale-traders
              - paragraph [ref=e1050]: Wholesale traders
        - generic [ref=e1051]:
          - paragraph [ref=e1052]: Pricing
          - generic [ref=e1054]:
            - link [ref=e1055] [cursor=pointer]:
              - /url: /pricing
              - paragraph [ref=e1056]: Pricing plans
            - link [ref=e1057] [cursor=pointer]:
              - /url: /pricing
              - paragraph [ref=e1058]: Transaction fees calculator
            - link [ref=e1059] [cursor=pointer]:
              - /url: /fees-and-pricing
              - paragraph [ref=e1060]: How our fees work
        - generic [ref=e1061]:
          - paragraph [ref=e1062]: Resources
          - generic [ref=e1064]:
            - link [ref=e1065] [cursor=pointer]:
              - /url: /solutions
              - paragraph [ref=e1066]: Use cases
            - link [ref=e1067] [cursor=pointer]:
              - /url: /payment-guide
              - paragraph [ref=e1068]: Payment guides
            - link [ref=e1069] [cursor=pointer]:
              - /url: /help-centre
              - paragraph [ref=e1070]: Help centre
            - link [ref=e1071] [cursor=pointer]:
              - /url: /help-centre/compliance-and-security
              - paragraph [ref=e1072]: Compliance & security
        - generic [ref=e1073]:
          - paragraph [ref=e1074]: Company
          - generic [ref=e1076]:
            - link [ref=e1077] [cursor=pointer]:
              - /url: /our-story
              - paragraph [ref=e1078]: Our story
            - link [ref=e1079] [cursor=pointer]:
              - /url: /partnerships
              - paragraph [ref=e1080]: Become a partner
            - link [ref=e1081] [cursor=pointer]:
              - /url: /news-and-blog
              - paragraph [ref=e1082]: Newsroom & blog
            - link [ref=e1083] [cursor=pointer]:
              - /url: /careers
              - paragraph [ref=e1084]: Careers
        - generic [ref=e1085]:
          - paragraph [ref=e1086]: Head office
          - generic [ref=e1087]:
            - paragraph [ref=e1088]: 45 Folgate Street London E1 6GL
            - separator [ref=e1089]
            - link [ref=e1090] [cursor=pointer]:
              - /url: tel:+4402038079645
              - paragraph [ref=e1091]: +44 (0) 203 807 9645
            - separator [ref=e1092]
            - link [ref=e1093] [cursor=pointer]:
              - /url: mailto:info@3s.money
              - paragraph [ref=e1094]: info@3s.money
      - generic [ref=e1096]:
        - paragraph [ref=e1097]: Subscribe to our newsletter to receive the latest updates from 3S Money
        - generic [ref=e1098]:
          - link [ref=e1099] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/3s-money
          - link [ref=e1102] [cursor=pointer]:
            - /url: https://www.instagram.com/3s.money
          - link [ref=e1105] [cursor=pointer]:
            - /url: https://www.facebook.com/3smoney
          - link [ref=e1108] [cursor=pointer]:
            - /url: https://wa.me/message/WEXUHASUANWKE1
        - generic [ref=e1112]:
          - generic [ref=e1113]:
            - textbox "Your Email" [ref=e1116]
            - button "oval-loading Subscribe" [ref=e1117] [cursor=pointer]:
              - status "oval-loading" [ref=e1119]
              - generic [ref=e1125]: Subscribe
          - generic [ref=e1128]:
            - checkbox [ref=e1129] [cursor=pointer]
            - paragraph [ref=e1133] [cursor=pointer]: I agree to subscribe to 3S Money marketing emails.I can unsubscribe at any time.
          - generic [ref=e1135]:
            - checkbox [ref=e1136] [cursor=pointer]
            - paragraph [ref=e1140] [cursor=pointer]:
              - text: By clicking “subscribe” I confirm I have read the
              - link "privacy policy" [ref=e1141]:
                - /url: /privacy-policy
              - text: and agree to its terms
      - generic [ref=e1143]:
        - generic [ref=e1145]:
          - link [ref=e1146] [cursor=pointer]:
            - /url: /terms
            - paragraph [ref=e1147]: Terms and conditions
          - link [ref=e1148] [cursor=pointer]:
            - /url: /vulnerable-customer-statement
            - paragraph [ref=e1149]: Vulnerable customer statement
          - link [ref=e1150] [cursor=pointer]:
            - /url: /consumer-duty
            - paragraph [ref=e1151]: Consumer duty
          - link [ref=e1152] [cursor=pointer]:
            - /url: /privacy-policy
            - paragraph [ref=e1153]: Privacy policy
          - link [ref=e1154] [cursor=pointer]:
            - /url: /cookies
            - paragraph [ref=e1155]: Cookies
          - link [ref=e1156] [cursor=pointer]:
            - /url: /esg-statement
            - paragraph [ref=e1157]: ESG Statement
          - link [ref=e1158] [cursor=pointer]:
            - /url: /cardholder-agreement
            - paragraph [ref=e1159]: Cardholder Agreement
        - generic [ref=e1160]:
          - link [ref=e1161] [cursor=pointer]:
            - /url: https://apps.apple.com/us/app/3s-money/id6452016748?itsct=apps_box_badge&itscg=30200
          - link [ref=e1167] [cursor=pointer]:
            - /url: https://play.google.com/store/apps/details?id=com.mobile3smoney.app&pcampaignid=web_share&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1
        - paragraph [ref=e1171]: © 3S Money Club Limited 2019-2026. All rights reserved. 3S Money and 3s.money are trading names of 3S Money Club Limited. 3S Money Club Limited is authorised by the Financial Conduct Authority under the Electronic Money Regulations 2011 for issuing of electronic money and the provision of payment services with FCA registration number 900918. 3S Money Club Limited is registered in England and Wales, Company Number 08574246, with its registered office address at 45 Folgate Street, London, E1 6GL, United Kingdom. 3S Money Club Limited is registered with The United Kingdom Information Commissioner's Office with ICO registration number ZA495485. 3S Money Club Limited (DIFC Branch) is regulated by the Dubai Financial Services Authority (DFSA) with DFSA reference number F007004, authorising it under Article 48 of the Regulatory Law 2004 to carry on the Financial Services comprised in Issuing Payment Instruments and Providing or Operating a Payment Account. 3S Money Club Limited (DIFC Branch) is registered in Dubai International Financial Centre, Licence Number CL5587, with its registered office address at Central Park Towers, Office 17-37, DIFC, Dubai, UAE. 3S Money (Luxembourg) S.A. is authorised by the Commission de Surveillance du Secteur Financier (CSSF) under the law of 10 November 2009 on payment services for issuing, distribution and refund of electronic money with CSSF registration number W00000016. 3S Money (Luxembourg) S.A. is registered in Luxembourg, R.C.S number B245715, with its registered office address at 25C, Boulevard Royal, L- 2449 Luxembourg, Grand Duchy of Luxembourg
  - alert [ref=e1172]
  - iframe [aria-hidden] [ref=e1173]
  - button "Open cookie settings widget" [ref=e1175] [cursor=pointer]
```

# Test source

```ts
  1  | import AxeBuilder from '@axe-core/playwright';
  2  | import { test, expect, gotoPage, CookieBanner, knownBug } from '../../src';
  3  | 
  4  | /**
  5  |  * Тестирование доступности (a11y) по стандарту WCAG 2.1 A/AA
  6  |  * с помощью axe-core. Cookie-баннер исключаем — это сторонний виджет.
  7  |  */
  8  | const PAGES = ['/', '/contact-us', '/pricing'];
  9  | 
  10 | test.describe('Доступность (axe-core, WCAG 2.1 A/AA)', () => {
  11 |   for (const path of PAGES) {
  12 |     test(`страница ${path}: нет критичных нарушений доступности`, async ({ page }) => {
  13 |       test.setTimeout(120_000);
  14 |       knownBug('BUG-004');
  15 |       await gotoPage(page, path);
  16 | 
  17 |       const results = await new AxeBuilder({ page })
  18 |         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  19 |         .exclude(CookieBanner.SELECTOR)
  20 |         .exclude('iframe')
  21 |         .analyze();
  22 | 
  23 |       const severe = results.violations.filter(
  24 |         (v) => v.impact === 'critical' || v.impact === 'serious'
  25 |       );
  26 | 
  27 |       const report = severe
  28 |         .map(
  29 |           (v) =>
  30 |             `[${v.impact}] ${v.id}: ${v.help} (узлов: ${v.nodes.length})\n  пример: ${v.nodes[0]?.html?.slice(0, 150)}`
  31 |         )
  32 |         .join('\n');
  33 | 
  34 |       // Менее серьёзные нарушения фиксируем в аннотациях, не роняя тест.
  35 |       const minor = results.violations.filter(
  36 |         (v) => v.impact !== 'critical' && v.impact !== 'serious'
  37 |       );
  38 |       test.info().annotations.push({
  39 |         type: 'a11y-minor',
  40 |         description: minor.map((v) => `${v.id} (${v.impact}, узлов: ${v.nodes.length})`).join('; ') || 'нет',
  41 |       });
  42 | 
> 43 |       expect(severe, `Серьёзные нарушения a11y:\n${report}`).toEqual([]);
     |                                                              ^ Error: Серьёзные нарушения a11y:
  44 |     });
  45 |   }
  46 | });
  47 | 
```