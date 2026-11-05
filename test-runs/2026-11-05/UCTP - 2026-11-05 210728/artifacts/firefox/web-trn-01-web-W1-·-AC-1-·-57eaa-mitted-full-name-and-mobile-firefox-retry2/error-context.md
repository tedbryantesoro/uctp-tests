# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\trn-01-web.spec.ts >> W1 · AC-1 · show the exact created message with the submitted full name and mobile
- Location: tests\web\trn-01-web.spec.ts:34:5

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - note [ref=f1e2]: TRAINING — made-up data only
  - navigation "Main" [ref=f1e3]:
    - link "UCTP" [ref=f1e4] [cursor=pointer]:
      - /url: /
    - generic [ref=f1e5]:
      - link "Home" [ref=f1e6] [cursor=pointer]:
        - /url: /
      - link "Training setup" [ref=f1e7] [cursor=pointer]:
        - /url: /training
      - link "Teller POS" [ref=f1e8] [cursor=pointer]:
        - /url: /pos
      - link "Citizen portal" [ref=f1e9] [cursor=pointer]:
        - /url: /portal
      - link "Simulator" [ref=f1e10] [cursor=pointer]:
        - /url: /simulator
      - link "My data" [ref=f1e11] [cursor=pointer]:
        - /url: /my-data
      - link "API docs" [ref=f1e12] [cursor=pointer]:
        - /url: /docs
    - generic [ref=f1e14]:
      - text: not identified —
      - link "set your name" [ref=f1e15] [cursor=pointer]:
        - /url: "#"
  - dialog "Your name" [ref=f1e17]:
    - heading "Your name" [level=2] [ref=f1e18]
    - paragraph [ref=f1e19]:
      - text: Used to label your training data. 2–60 characters. Type
      - code [ref=f1e20]: Name-1234
      - text: to continue your existing data from another browser.
    - textbox "e.g. Ana" [ref=f1e21]: ted-1234
    - button "Save" [active] [ref=f1e22] [cursor=pointer]
  - main [ref=f1e23]:
    - heading "Unified City Treasury Platform — Tagaytay pilot" [level=1] [ref=f1e24]
    - paragraph [ref=f1e25]: Every flow starts here. Pick a role; each screen hands off to the next step.
    - generic [ref=f1e26]:
      - generic [ref=f1e27]:
        - heading "Training setup" [level=2] [ref=f1e28]
        - paragraph [ref=f1e29]: Create the taxpayers, bills, and teller booklets you will use in class.
        - link [ref=f1e30] [cursor=pointer]:
          - /url: /training
          - button "Create my data" [ref=f1e31]
      - generic [ref=f1e32]:
        - 'heading "Teller: POS" [level=2] [ref=f1e33]'
        - paragraph [ref=f1e34]: Counter cashiering — load an Order of Payment, tender cash or cheque, print the OR.
        - link [ref=f1e35] [cursor=pointer]:
          - /url: /pos
          - button "Open POS" [ref=f1e36]
      - generic [ref=f1e37]:
        - 'heading "Citizen: portal" [level=2] [ref=f1e38]'
        - paragraph [ref=f1e39]: Taxpayer self-service — look up what you owe and pay online.
        - link [ref=f1e40] [cursor=pointer]:
          - /url: /portal
          - button "Open portal" [ref=f1e41]
      - generic [ref=f1e42]:
        - 'heading "Bank: settlement simulator" [level=2] [ref=f1e43]'
        - paragraph [ref=f1e44]: Training tool that drives the real settlement endpoints with a simulated bank reference.
        - link [ref=f1e45] [cursor=pointer]:
          - /url: /simulator
          - button "Open simulator" [ref=f1e46]
      - generic [ref=f1e47]:
        - heading "My data" [level=2] [ref=f1e48]
        - paragraph [ref=f1e49]: Everything you created — taxpayers, bills, tellers, receipts — and the next action for each.
        - link [ref=f1e50] [cursor=pointer]:
          - /url: /my-data
          - button "See my data" [ref=f1e51]
      - generic [ref=f1e52]:
        - heading "API docs" [level=2] [ref=f1e53]
        - paragraph [ref=f1e54]: OpenAPI / Swagger reference for every endpoint in the platform.
        - link [ref=f1e55] [cursor=pointer]:
          - /url: /docs
          - button "Open API docs" [ref=f1e56]
```