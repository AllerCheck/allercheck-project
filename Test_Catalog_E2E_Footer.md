# Test Catalog: Footer Tests (Playwright)

## **1. Footer Rendering**
| ID  | Test Case                                  | Expected Result |
| --- | ----------------------------------------- | --------------- |
| FT-01 | Footer is correctly rendered | The footer should be visible on the page |
| FT-02 | Footer contains copyright text | The text `© {current year} AllerCheck. All rights reserved.` should be present |

## **2. Footer Links & Modals**
| ID  | Test Case                                  | Expected Result |
| --- | ----------------------------------------- | --------------- |
| FT-03 | Contact modal opens and closes | Clicking "Contact" should open the modal, which should close when clicking "Close" |
| FT-04 | Impress modal opens and closes | Clicking "Impress" should open the modal, which should close when clicking "Close" |
| FT-05 | Policies modal opens and closes | Clicking "Policies" should open the modal, which should close when clicking "Close" |
| FT-06 | Data Protection modal opens and closes | Clicking "Data Protection" should open the modal, which should close when clicking "Close" |

## **3. Footer Styling**
| ID  | Test Case                                  | Expected Result |
| --- | ----------------------------------------- | --------------- |
| FT-07 | Footer has correct background color | The footer should have a gradient background (`from-gray-900 via-gray-800 to-gray-70`) |
| FT-08 | Footer links have hover effects | Footer links should change appearance when hovered |

## **4. Accessibility & Responsiveness**
| ID  | Test Case                                  | Expected Result |
| --- | ----------------------------------------- | --------------- |
| FT-09 | Footer is accessible via keyboard navigation | Users should be able to navigate using `Tab` key |
| FT-10 | Footer is correctly displayed on mobile devices | Footer should not overlap or break layout on smaller screens |

---

### **Notes**
- **Test Environment:** Localhost (`http://localhost:5173`)
- **Testing Tool:** Playwright
- **Browser Coverage:** Chrom
