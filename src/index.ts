import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

app.use("/api", projectRoutes);

app.use("/api", taskRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connesso con successo");
    app.get("/", (req, res) => {
      console.log("Qualcuno ha bussato alla porta!", req.method);
      res.send("L'API è online! Pronto per i Progetti e i Task.");
    });
  })
  .catch((err) =>
    console.log("Errore durante la connessione del database: ", err),
  );

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
