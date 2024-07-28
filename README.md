## Description
Parsing your e-statement from Jago Syariah app into CSV. Inspired from https://startkit.tech/bank-statement-converter but running locally and support my yearly budgeting :D

## Diagram
![Screenshot 2024-01-07 at 12 30 35](https://github.com/irfanhkm/jago-syariah-statement-parser/assets/30617181/933f7482-1485-4f87-8df8-5c7a7174e378)

### Example:
- input:
  - ![Screenshot 2024-01-07 at 12 14 26](https://github.com/irfanhkm/jago-syariah-statement-parser/assets/30617181/44a9bcc6-94a1-4fbe-8993-be1f3e06c026)
- output (separate with ~):
  - ```
    2023-02-09T07:46:00+07:00~IRFAN HAKIM GoPay 08133xxxxxxx~-200000~Outgoing Transfer ID# 18973xxxx
    ```

### Prequisite
- Install node js: [mac](https://nodejs.org/en/download/package-manager/all#macos), [windows](https://nodejs.org/en/download/package-manager/all#windows-1)
- Install yarn: [mac]https://formulae.brew.sh/formula/yarn

### How to use it
1. Clone the project, run installation
   a. run command `yarn install`
3. Put your pdf file statement into the input folder
4. Run the project.
   a. run command `yarn start`


### How to export statements from Jago App Syariah
Follow this instruction: https://www.jago.com/id/syariah/support/faq/menggunakan-jago/kantong/download-e-statement-dan-riwayat-transaksi
