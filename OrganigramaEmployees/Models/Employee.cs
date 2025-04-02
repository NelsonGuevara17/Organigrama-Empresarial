using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrganigramaEmployees.Models
{
    public class Employee
    {
        [Column("id")]
        public string Id { get; set; }

        [Column("pid")]
        public string Pid { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("role")]
        public string Role { get; set; }

        [Column("mail")]
        public string Mail { get; set; }

        [Column("img")]
        public string Img { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("date")]
        public DateTime? Date { get; set; }

        [Column("estate")]
        public string Estate { get; set; }
    }
}
