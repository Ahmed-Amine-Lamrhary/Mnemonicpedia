const ObjectId = require("mongoose").Types.ObjectId;

const getAll = async (Model, find, res, references) => {
  const { query = {}, select = "", skip = 0, limit, sort } = find;
  try {
    const items = await Model.find(query)
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    if (references) {
      for (let j = 0; j < references.length; j++) {
        const { RModel, field, rselect = "" } = references[j];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          const reference = await RModel.find({
            _id: { $in: item[field] },
          }).select(rselect);

          if (Array.isArray(item[field])) {
            item[field].splice(0, item[field].length, ...reference);
          } else item[field] = reference[0];
        }
      }
    }

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getItem = async (Model, req, res, query, select, references) => {
  const { id } = req.params;

  // check if id is valid
  if (!ObjectId.isValid(id))
    return res.status(400).json({ error: "Id is not valid" });

  // check if item exists
  try {
    const item = await Model.findOne({ _id: id, ...query }).select(select);
    if (!item)
      return res
        .status(404)
        .json({ error: `${Model.collection.collectionName} does not exist` });

    if (references) {
      for (let j = 0; j < references.length; j++) {
        const { RModel, field, rselect = "" } = references[j];

        const reference = await RModel.find({
          _id: { $in: item[field] },
        }).select(rselect);

        if (Array.isArray(item[field])) {
          item[field].splice(0, item[field].length, ...reference);
        } else item[field] = reference[0];
      }
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getItem,
};
