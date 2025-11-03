import { app } from "./app";
import { env } from "./config/env";

const port = env.PORT;

app.listen(port, () => {
  console.log(`Movement Safety API listening on port ${port}`);
});
