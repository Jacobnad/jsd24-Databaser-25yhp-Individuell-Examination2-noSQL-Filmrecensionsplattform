export default (fn) => {
  return (req, res, next) => {
    // Kör den asynkrona funktionen fn med req, res och next
    // Om ett fel uppstår fångas det och skickas vidare till nästa middleware (errorhanteraren)
    fn(req, res, next).catch(next);
  };
};
