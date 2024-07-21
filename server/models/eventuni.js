
module.exports = (sequelize, DataTypes) => {
    const UniEvent = sequelize.define('UniEvent', {
      
      logo: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      starttime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endtime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      
    });
    UniEvent.associate = models => {
        UniEvent.belongsTo(models.University, {
          foreignKey: 'university_id',
          as: 'university',
        });
        
        UniEvent.hasMany(models.Eventroom, {
            foreignKey: 'event_id',
            as: 'eventrooms',
          });
        UniEvent.hasMany(models.Eventregister, {
            foreignKey: 'event_id',
            as: 'eventregister',
          });
    };
    return UniEvent;
};