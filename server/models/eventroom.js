module.exports = (sequelize, DataTypes) => {
  const Eventroom = sequelize.define('Eventroom', {
      roomno: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      accessories: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      space: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      spaceleft: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });

  Eventroom.associate = models => {
      // Define associations with other models using the passed 'models' object
      
      Eventroom.belongsTo(models.UniEvent, {
          foreignKey: 'event_id',
          as: 'unievent',
      });
      Eventroom.hasMany(models.Roomallocation, {
        foreignKey: 'room_id',
        as: 'Roomallocation',
      });
  };
  

  return Eventroom;
};
