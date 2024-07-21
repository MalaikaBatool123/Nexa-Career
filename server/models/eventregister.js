
module.exports = (sequelize, DataTypes) => {
    const Eventregister = sequelize.define('Eventregister', {
      
      person: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      arrivingtime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      accessories: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expectedhiringno: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobtype: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      
    });
    Eventregister.associate = models => {
        Eventregister.belongsTo(models.UniEvent, {
          foreignKey: 'event_id',
          as: 'UniEvent',
        });
   
        Eventregister.belongsTo(models.Company, {
          foreignKey: 'company_id',
          as: 'company',
        }); 
        Eventregister.hasMany(models.Roomallocation, {
          foreignKey: 'eventregistration_id',
          as: 'Roomallocation',
        });
        
    };
    return Eventregister;
};