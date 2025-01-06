# ZapCron

ZapCron is a cron-based HTTP webhook automation tool designed to simplify task scheduling and execution for IT engineers and general users. With customizable schedules, API support, and robust logging, ZapCron makes automating webhook calls seamless and efficient.

## Features

- **Customizable Schedules:** Define when and how often your webhooks are triggered.
- **API Support:** Easily integrate with your existing applications.
- **Logging:** Track and debug webhook calls with comprehensive logs.

## Prerequisites

Ensure the following are installed on your system before running ZapCron:

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/)
- The [zapcron-scheduler](https://github.com/fllaa/zapcron-scheduler) must be running to enable scheduling functionality.

---

## Installation

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fllaa/zapcron.git
   cd zapcron
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration.

4. Run database push migration:
   ```bash
   bun run db:push
   ```

5. Start the application:
   ```bash
   bun run start
   ```

### Docker Installation

1. Pull the Docker image:
   ```bash
   docker pull fallavall/zapcron:main
   ```
2. Run the container with your environment variables:
   ```bash
   docker run -d --env-file .env -p 3000:3000 fallavall/zapcron:main
   ```

## Configuration

ZapCron uses environment variables for configuration. Refer to the provided `.env.example` file for required and optional variables. Customize it according to your needs.

## Usage

Once ZapCron is running, you can define your webhook schedules and manage them through the API. Refer to the API documentation (coming soon) for detailed instructions.

## Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss your ideas.

## License

This project is licensed under the GNU General Public License (GPL). See the [LICENSE](LICENSE) file for details.

---

Happy automating with ZapCron!
